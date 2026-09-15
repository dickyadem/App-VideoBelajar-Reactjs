import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { courses } from '../data/courses';
import '../../assets/css/classes.css';

const tabs = [
  { id: 'all', label: 'Semua Kelas' },
  { id: 'running', label: 'Sedang Berjalan' },
  { id: 'completed', label: 'Selesai' },
];
const enrollments = [
  { progress: 100, status: 'Selesai', modules: 12 },
  { progress: 28, status: 'Sedang Berjalan', modules: 2 },
  { progress: 28, status: 'Sedang Berjalan', modules: 2 },
].map((enrollment, index) => ({ ...enrollment, course: courses[index] }));

function ClassCard({ enrollment }) {
  const { course, progress, status, modules } = enrollment;
  return <article className="class-card" aria-label={`Kelas ${status}`}>
    <div className="class-card-header"><span>{modules} / 12 Modul Terselesaikan</span><span className={`class-status class-status-${status === 'Selesai' ? 'completed' : 'running'}`}>{status}</span></div>
    <div className="class-card-body"><img src={course.image} alt={course.imageAlt} /><div className="class-card-info"><h2>{course.title}</h2><p>{course.description}</p><div className="class-instructor"><img src={course.instructorImage} alt="" /><span><strong>{course.instructorName}</strong><small>{course.instructorRole}</small></span></div><div className="class-meta"><span>▣ 12 Modul</span><span>◷ 360 Menit</span></div></div></div>
    <div className="class-card-footer"><span>Progres Kelas: <strong>{progress}%</strong></span><div className="class-progress"><span style={{ width: `${progress}%` }} /></div>{status === 'Selesai' ? <><button className="class-outline-action" type="button">Unduh Sertifikat</button><Link className="class-primary-action" to={`/learn/${course.slug}`}>Lihat Detail Kelas</Link></> : <Link className="class-primary-action class-continue" to={`/learn/${course.slug}`}>Lanjutkan Pembelajaran</Link>}</div>
  </article>;
}

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => enrollments.filter((enrollment) => {
    const matchesTab = activeTab === 'all' || (activeTab === 'completed' && enrollment.status === 'Selesai') || (activeTab === 'running' && enrollment.status === 'Sedang Berjalan');
    return matchesTab && enrollment.course.title.toLowerCase().includes(query.toLowerCase());
  }), [activeTab, query]);
  return <><Header /><main className="classes-page container"><aside className="classes-sidebar"><h1>Daftar Kelas</h1><p>Akses Materi Belajar dan Mulailah Meningkatkan Pengetahuan Anda!</p><nav aria-label="Navigasi kelas"><Link to="/profile" aria-label="Profil Saya" className="classes-nav-item">♟ <span>Profil Saya</span></Link><Link to="/classes" aria-label="Kelas Saya" className="classes-nav-item is-active">▣ <span>Kelas Saya</span></Link><Link to="/orders" aria-label="Pesanan Saya" className="classes-nav-item">♧ <span>Pesanan Saya</span></Link></nav></aside><section className="classes-content"><div className="classes-toolbar-top"><div className="classes-tabs" role="tablist" aria-label="Filter kelas">{tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}</div><label className="classes-search"><span className="sr-only">Cari Kelas</span><input type="search" aria-label="Cari Kelas" placeholder="Cari Kelas" value={query} onChange={(event) => setQuery(event.target.value)} /><span aria-hidden="true">⌕</span></label></div><div className="class-list">{filtered.length ? filtered.map((enrollment, index) => <ClassCard key={`${enrollment.course.slug}-${index}`} enrollment={enrollment} />) : <p className="classes-empty">Kelas tidak ditemukan</p>}</div><nav className="classes-pagination" aria-label="Paginasi kelas"><button type="button" aria-label="Halaman sebelumnya">‹</button><button type="button" aria-current="page">1</button><button type="button">2</button><button type="button">3</button><button type="button" aria-label="Halaman berikutnya">›</button></nav></section></main><Footer /></>;
}
