export default function CourseCard({ course }) {
  return <article className="course-card">
    <img className="course-image" src={course.image} alt={course.imageAlt} />
    <div className="course-body">
      <h3>{course.title}</h3><p>{course.description}</p>
      <div className="instructor"><img className="instructor-avatar" src={course.instructorImage} alt={course.instructorName} /><div className="instructor-info"><span className="instructor-name">{course.instructorName}</span><span className="instructor-role">{course.instructorRole}</span></div></div>
      <div className="course-footer"><div className="rating"><span className="stars">★★★★☆</span><span className="rating-score">{course.rating}</span></div><span className="price">{course.price}</span></div>
    </div>
  </article>;
}
