import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import { courses } from '../../data/courses';
import { courseDetails } from '../../data/courseDetails';
import { paymentGroups } from '../../data/paymentMethods';

const parseRating = (rating) => Number.parseFloat(rating) || 0;
const parseReviewCount = (rating) => Number.parseInt(rating.match(/\((\d+)\)/)?.[1] || '0', 10);

export async function seedCourses() {
  const batch = writeBatch(db);

  [...new Set(courses.map((course) => course.category))].forEach((slug) => {
    const categoryRef = doc(db, 'categories', slug);
    batch.set(categoryRef, {
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
    }, { merge: true });
  });

  paymentGroups.flatMap((group) => group.options.map((option) => ({
    ...option,
    type: group.id,
  }))).forEach((method) => {
    const methodRef = doc(db, 'payment-methods', method.id);
    batch.set(methodRef, {
      type: method.type,
      name: method.name,
      brand: method.brand || '',
      color: method.color || '',
      isActive: true,
    }, { merge: true });
  });

  const instructors = new Map();
  courses.forEach((course) => {
    instructors.set(course.instructorName, {
      name: course.instructorName,
      role: course.instructorRole,
      avatar: course.instructorImage,
    });
  });
  instructors.forEach((instructor, name) => {
    batch.set(doc(db, 'instructors', name.toLowerCase().replaceAll(' ', '-')), instructor, { merge: true });
  });

  courses.forEach((course) => {
    const courseRef = doc(db, 'courses', course.slug);
    const details = courseDetails[course.slug];

    batch.set(courseRef, {
      slug: course.slug,
      title: course.title,
      description: details?.description || course.description,
      image: course.image,
      imageAlt: course.imageAlt,
      category: course.category,
      instructorName: course.instructorName,
      instructorRole: course.instructorRole,
      instructorImage: course.instructorImage,
      tutorBio: details?.tutorBio || '',
      priceAmount: course.priceAmount,
      price: course.price,
      rating: parseRating(course.rating),
      ratingLabel: course.rating,
      reviewCount: parseReviewCount(course.rating),
      status: 'published',
    }, { merge: true });

    details?.modules?.forEach((module, moduleIndex) => {
      const moduleId = `${course.slug}-module-${moduleIndex + 1}`;
      batch.set(doc(db, 'modules', moduleId), {
        courseId: course.slug,
        title: module.title,
        order: moduleIndex + 1,
      }, { merge: true });
      const moduleRef = doc(courseRef, 'modules', `module-${moduleIndex + 1}`);
      batch.set(moduleRef, {
        title: module.title,
        order: moduleIndex + 1,
      }, { merge: true });

      module.lessons.forEach((lesson, lessonIndex) => {
        batch.set(doc(db, 'lessons', `${moduleId}-lesson-${lessonIndex + 1}`), {
          courseId: course.slug,
          moduleId,
          title: lesson.title,
          minutes: lesson.minutes,
          order: lessonIndex + 1,
          videoUrl: '',
          isPreview: lessonIndex === 0,
        }, { merge: true });
        const lessonRef = doc(moduleRef, 'lessons', `lesson-${lessonIndex + 1}`);
        batch.set(lessonRef, {
          title: lesson.title,
          minutes: lesson.minutes,
          order: lessonIndex + 1,
          videoUrl: '',
          isPreview: lessonIndex === 0,
        }, { merge: true });
      });
    });

    details?.reviews?.forEach((review, reviewIndex) => {
      batch.set(doc(db, 'reviews', `${course.slug}-review-${reviewIndex + 1}`), {
        courseId: course.slug,
        name: review.name,
        batch: review.batch,
        text: review.text,
      }, { merge: true });
      const reviewRef = doc(courseRef, 'reviews', `review-${reviewIndex + 1}`);
      batch.set(reviewRef, {
        name: review.name,
        batch: review.batch,
        text: review.text,
      }, { merge: true });
    });
  });

  await batch.commit();
}