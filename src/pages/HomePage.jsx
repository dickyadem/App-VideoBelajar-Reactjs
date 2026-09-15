import { useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryTabs from '../components/CategoryTabs';
import CourseCard from '../components/CourseCard';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { courses } from '../data/courses';

const categories = [['all', 'Semua Kelas'], ['marketing', 'Pemasaran'], ['design', 'Desain'], ['personal', 'Pengembangan Diri'], ['business', 'Bisnis']];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [message, setMessage] = useState('');
  const visibleCourses = selectedCategory === 'all' ? courses : courses.filter((course) => course.category === selectedCategory);
  const subscribe = (event) => { event.preventDefault(); setMessage('Terima kasih. Anda sudah terdaftar di newsletter kami.'); event.currentTarget.reset(); };

  return <><Header /><main><section className="hero"><div className="hero-content"><p className="eyebrow">Belajar tanpa batas</p><h1>Temukan ilmu baru melalui video pembelajaran interaktif.</h1><p>Bangun skill yang relevan bersama mentor berpengalaman, materi terarah, dan latihan yang membuat proses belajar terasa nyata.</p><a className="btn btn-primary" href="#koleksi" onClick={(event) => { event.preventDefault(); document.getElementById('koleksi')?.scrollIntoView({ behavior: 'smooth' }); }}>Jelajahi Video Course</a></div></section><section className="section" id="koleksi"><div className="container"><div className="section-heading"><div><p className="eyebrow" style={{ color: 'var(--primary-dark)' }}>Koleksi pilihan</p><h2>Video pembelajaran unggulan</h2><p>Jelajahi kelas yang dirancang untuk membantu langkah berikutnya.</p></div><Link className="header-link" to="/register">Lihat semua kelas</Link></div><CategoryTabs categories={categories} selectedCategory={selectedCategory} onChange={setSelectedCategory} /><div className="course-grid">{visibleCourses.map((course) => <CourseCard key={course.title} course={course} />)}</div></div></section><section className="newsletter"><div className="newsletter-content"><p className="eyebrow">Newsletter videobelajar</p><h2>Belajar sedikit demi sedikit, bertumbuh setiap hari.</h2><p>Dapatkan rekomendasi kelas, insight karier, dan tips belajar langsung ke email Anda.</p><form className="newsletter-form" onSubmit={subscribe}><label className="sr-only" htmlFor="newsletter-email">Email</label><input id="newsletter-email" type="email" placeholder="Alamat email Anda" required /><button className="btn btn-accent" type="submit">Subscribe</button></form><p className="form-message" aria-live="polite">{message}</p></div></section></main><Footer /></>;
}
