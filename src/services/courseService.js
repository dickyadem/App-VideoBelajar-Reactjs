import { collection, getDocsFromServer } from 'firebase/firestore';
import { db } from '../firebase';

export async function readCollection(name) {
  const snapshot = await getDocsFromServer(collection(db, name));
  return snapshot.docs.map((item) => ({ ...item.data(), id: item.id }));
}

const byOrder = (first, second) => (Number(first.order) || 0) - (Number(second.order) || 0);

export async function getCourseCatalog() {
  const [documents, modules, lessons, reviews] = await Promise.all([
    readCollection('courses'),
    readCollection('modules'),
    readCollection('lessons'),
    readCollection('reviews'),
  ]);

  const courses = documents.filter((course) => course.status === 'published').map((course) => ({
    ...course,
    slug: course.slug || course.id,
    priceAmount: Number(course.priceAmount) || 0,
    price: `Rp ${(Number(course.priceAmount) || 0).toLocaleString('id-ID')}`,
    rating: `${Number.parseFloat(course.rating) || 0} (${Number(course.reviewCount) || 0})`,
    imageAlt: course.imageAlt || course.title,
  }));

  const courseDetails = Object.fromEntries(courses.map((course) => [course.slug, {
    description: course.description || '',
    tutorBio: course.tutorBio || '',
    modules: modules.filter((module) => module.courseId === course.id).sort(byOrder).map((module) => ({
      ...module,
      lessons: lessons.filter((lesson) => lesson.courseId === course.id && lesson.moduleId === module.id)
        .sort(byOrder).map((lesson) => ({ ...lesson, minutes: Number(lesson.minutes) || 0 })),
    })),
    reviews: reviews.filter((review) => review.courseId === course.id),
  }]));

  return { courses, courseDetails };
}
