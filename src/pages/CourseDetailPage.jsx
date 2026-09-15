import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import PurchaseCard from '../components/PurchaseCard';
import { courses } from '../data/courses';
import { courseDetails } from '../data/courseDetails';
import '../../assets/css/course-detail.css';

const categoryLabels = { business: 'Bisnis Manajemen', marketing: 'Pemasaran', design: 'Desain', personal: 'Pengembangan Diri' };

function Rating({ label }) {
  return <span className="detail-rating"><span className="detail-stars" aria-hidden="true">★★★★★</span><span>{label}</span></span>;
}

function CourseContent({ course, detail }) {
  const related = courses.filter((item) => item.slug !== course.slug)
    .sort((a, b) => Number(b.category === course.category) - Number(a.category === course.category))
    .slice(0, 3);

  return (
    <main className="course-detail container">
      <nav className="detail-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Beranda</Link><span aria-hidden="true">/</span>
        <Link to="/category">{categoryLabels[course.category]}</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{course.title}</span>
      </nav>

      <section className="detail-hero" aria-labelledby="course-title" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.72), rgba(0,0,0,.72)), url("${course.image}")` }}>
        <div>
          <h1 id="course-title">{course.title}</h1>
          <p>Belajar bersama tutor profesional di Video Course.<br />Kapan pun, di mana pun.</p>
          <a href="#course-reviews" aria-label={`Lihat rating dan review ${course.rating}`}><Rating label={course.rating} /></a>
        </div>
      </section>

      <div className="detail-layout">
        <div className="detail-sections">
          <section className="detail-panel" aria-labelledby="description-title">
            <h2 id="description-title">Deskripsi</h2>
            <p className="detail-muted">{detail.description}</p>
          </section>

          <section className="detail-panel" aria-labelledby="tutors-title">
            <h2 id="tutors-title">Belajar bersama Tutor Profesional</h2>
            <article className="detail-person">
              <div className="detail-person-heading">
                <img src={course.instructorImage} alt="" />
                <div><h3>{course.instructorName}</h3><p>{course.instructorRole}</p></div>
              </div>
              <p>{detail.tutorBio}</p>
            </article>
          </section>

          <section className="detail-panel curriculum" aria-labelledby="curriculum-title">
            <h2 id="curriculum-title">Kamu akan Mempelajari</h2>
            {detail.modules.map((section, index) => (
              <details key={section.title} open={index === 0}>
                <summary>{section.title}<span className="curriculum-chevron" aria-hidden="true">⌄</span></summary>
                <ul>
                  {section.lessons.map((lesson) => (
                    <li key={lesson.title}>
                      <span>{lesson.title}</span>
                      <span className="lesson-meta"><span>▷ Video</span><span>◷ {lesson.minutes} Menit</span></span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </section>

          <section id="course-reviews" className="detail-panel" aria-labelledby="reviews-title">
            <h2 id="reviews-title">Rating dan Review</h2>
            <p className="detail-demo-note">Contoh ulasan untuk tampilan demo.</p>
            <div className="detail-review-grid">
              {detail.reviews.map((review) => (
                <article className="detail-person" key={review.name}>
                  <div className="detail-person-heading">
                    <span className="review-avatar" aria-hidden="true">{review.name.split(' ').map((word) => word[0]).join('')}</span>
                    <div><h3>{review.name}</h3><p>{review.batch}</p></div>
                  </div>
                  <p>{review.text}</p>
                  <Rating label="3.5" />
                </article>
              ))}
            </div>
          </section>
        </div>

        <PurchaseCard course={course} modules={detail.modules} />
      </div>

      <section className="detail-related" aria-labelledby="related-title">
        <h2 id="related-title">Video Pembelajaran Terkait Lainnya</h2>
        <p className="detail-muted">Ekspansi pengetahuan Anda dengan rekomendasi spesial kami!</p>
        <div className="detail-related-grid">
          {related.map((item) => <CourseCard key={item.slug} course={item} />)}
        </div>
      </section>
    </main>
  );
}

export default function CourseDetailPage() {
  const { slug } = useParams();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, [slug]);
  const course = courses.find((item) => item.slug === slug);
  const detail = course && courseDetails[course.slug];

  return <><Header />{course && detail ? <CourseContent key={slug} course={course} detail={detail} /> : (
    <main className="container detail-not-found">
      <h1>Kelas tidak ditemukan</h1>
      <p>Kelas yang Anda cari belum tersedia. Temukan kelas lainnya di katalog.</p>
      <Link className="btn btn-primary" to="/category">Jelajahi kelas</Link>
    </main>
  )}<Footer /></>;
}
