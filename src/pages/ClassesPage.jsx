import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { courses } from '../data/courses';
import { courseDetails } from '../data/courseDetails';
import { useOrders } from '../context/useOrders';
import { useAuth } from '../context/AuthContext';
import '../../assets/css/classes.css';

const tabs = [
  { id: 'all', label: 'Semua Kelas' },
  { id: 'running', label: 'Sedang Berjalan' },
  { id: 'completed', label: 'Selesai' },
];


function ClassCard({ enrollment }) {
  const { course, progress, status, modules, total, minutes } = enrollment;
  return <article className="class-card" aria-label={`Kelas ${status}`}>
    <div className="class-card-header"><span>{modules} / {total} Modul Terselesaikan</span><span className={`class-status class-status-${status === 'Selesai' ? 'completed' : 'running'}`}>{status}</span></div>
    <div className="class-card-body"><img src={course.image} alt={course.imageAlt} /><div className="class-card-info"><h2>{course.title}</h2><p>{course.description}</p><div className="class-instructor"><img src={course.instructorImage} alt="" /><span><strong>{course.instructorName}</strong><small>{course.instructorRole}</small></span></div><div className="class-meta"><span>▣ {total} Modul</span><span>◷ {minutes} Menit</span></div></div></div>
    <div className="class-card-footer"><span>Progres Kelas: <strong>{progress}%</strong></span><div className="class-progress"><span style={{ width: `${progress}%` }} /></div>{status === 'Selesai' ? <><Link className="class-outline-action" to={`/course/${course.slug}/certificate`}>Unduh Sertifikat</Link><Link className="class-primary-action" to={`/learn/${course.slug}`}>Lihat Detail Kelas</Link></> : <Link className="class-primary-action class-continue" to={`/learn/${course.slug}`}>Lanjutkan Pembelajaran</Link>}</div>
  </article>;
}

export default function ClassesPage() {
  const { orders } = useOrders();
  const { user } = useAuth();
  const enrollments = courses.filter((course) => orders.some((order) => order.slug === course.slug && order.status === 'Berhasil')).map((course) => {
    const lessons = courseDetails[course.slug].modules.flatMap((module) => module.lessons);
    const ids = ['pretest', ...lessons.map((lesson) => lesson.title), 'summary', 'quiz', 'exam'];
    let completed = [];
    try { const saved = JSON.parse(localStorage.getItem('videobelajar-progress:' + user.name + ':' + course.slug)); if (Array.isArray(saved)) completed = saved; } catch {} 
    const modules = ids.filter((id) => completed.includes(id)).length;
    return { course, modules, total: ids.length, minutes: lessons.reduce((sum, lesson) => sum + lesson.minutes, 0), progress: Math.round(modules / ids.length * 100), status: modules === ids.length ? 'Selesai' : 'Sedang Berjalan' };
  });
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');
  const filtered = enrollments.filter((enrollment) => {
    const matchesTab = activeTab === 'all' || (activeTab === 'completed' && enrollment.status === 'Selesai') || (activeTab === 'running' && enrollment.status === 'Sedang Berjalan');
    return matchesTab && enrollment.course.title.toLowerCase().includes(query.toLowerCase());
  });
  return <><Header /><main className="classes-page container"><aside className="classes-sidebar"><h1>Daftar Kelas</h1><p>Akses Materi Belajar dan Mulailah Meningkatkan Pengetahuan Anda!</p><nav aria-label="Navigasi kelas"><Link to="/profile" aria-label="Profil Saya" className="classes-nav-item">♟ <span>Profil Saya</span></Link><Link to="/classes" aria-label="Kelas Saya" className="classes-nav-item is-active">▣ <span>Kelas Saya</span></Link><Link to="/orders" aria-label="Pesanan Saya" className="classes-nav-item">♧ <span>Pesanan Saya</span></Link></nav></aside><section className="classes-content"><div className="classes-toolbar-top"><div className="classes-tabs" role="tablist" aria-label="Filter kelas">{tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}</div><label className="classes-search"><span className="sr-only">Cari Kelas</span><input type="search" aria-label="Cari Kelas" placeholder="Cari Kelas" value={query} onChange={(event) => setQuery(event.target.value)} /><span aria-hidden="true">⌕</span></label></div><div className="class-list">{filtered.length ? filtered.map((enrollment, index) => <ClassCard key={`${enrollment.course.slug}-${index}`} enrollment={enrollment} />) : <div className="classes-empty"><p>{enrollments.length ? 'Kelas tidak ditemukan' : 'Belum ada kelas yang dibeli'}</p>{!enrollments.length && <Link className="btn btn-primary" to="/category">Jelajahi Kelas</Link>}</div>}</div></section></main><Footer /></>;
}
