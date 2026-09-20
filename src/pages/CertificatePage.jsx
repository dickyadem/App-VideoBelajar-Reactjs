import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCourseProgress } from '../components/CourseProgress';
import { useCatalog } from '../context/CatalogContext';

import '../../assets/css/certificate.css';

const escapeXml = (text) => String(text).replace(/[<>&"']/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character]);

function certificateImage(name, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="707" viewBox="0 0 1000 707">
    <rect width="1000" height="707" fill="white"/><rect x="32" y="40" width="936" height="627" rx="28" fill="#f8f7f7"/>
    <g fill="#05be55"><path d="M810 0h190v200l-85 85a29 29 0 0 1-41-41l58-58-77 77a29 29 0 0 1-41-41l89-89-72 72a29 29 0 0 1-41-41l85-85-43 43a29 29 0 0 1-41-41z"/><path d="M0 707V525l80-80a29 29 0 0 1 41 41l-50 50 58-58a29 29 0 0 1 41 41l-70 70 44-44a29 29 0 0 1 41 41L64 707z"/></g>
    <g fill="#ffcf36"><circle cx="750" cy="10" r="56"/><circle cx="947" cy="311" r="25"/><circle cx="60" cy="407" r="26"/><circle cx="247" cy="700" r="51"/><path d="m851 0-28 28a24 24 0 0 0 34 34l62-62zM45 707l75-75a24 24 0 0 1 34 34l-41 41z"/></g>
    <text x="74" y="94" font-family="Arial,sans-serif" font-size="20" fill="#ffad15">videobelajar</text>
    <g text-anchor="middle" font-family="Arial,sans-serif"><text x="500" y="159" font-size="66" font-weight="700" fill="#008738">Certificate</text><text x="500" y="222" font-size="43">of Completion</text><text x="500" y="280" font-size="21" fill="#555">Diberikan kepada</text>
    <text x="500" y="366" font-family="Georgia,serif" font-style="italic" font-size="54" fill="#e9b30b" textLength="${Math.min(680, Math.max(200, name.length * 25))}" lengthAdjust="spacingAndGlyphs">${escapeXml(name)}</text>
    <path d="M225 397h550" stroke="#a7a29c" stroke-width="2"/><text x="500" y="431" font-size="20">Atas penyelesaian seluruh modul kelas</text><text x="500" y="469" font-size="24" font-weight="700" textLength="650" lengthAdjust="spacingAndGlyphs">${escapeXml(title)}</text>
    <circle cx="500" cy="551" r="42" fill="#008738"/><circle cx="500" cy="551" r="32" fill="#ffcf36"/><text x="500" y="569" font-size="48" fill="#008738">★</text><text x="500" y="627" font-size="18" fill="#555">VideoBelajar · Sertifikat Penyelesaian</text></g></svg>`;
}

export default function CertificatePage() {
  const { courses, courseDetails } = useCatalog();
  const { slug } = useParams();
  const course = courses.find((item) => item.slug === slug);
  const progress = useCourseProgress(slug, courseDetails[slug]);
  const image = course && progress.complete ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(certificateImage(progress.name, course.title))}` : '';
  return <div className="certificate-page"><Header /><main className="container certificate-main">
    <nav className="certificate-breadcrumb" aria-label="Breadcrumb"><Link to="/">Beranda</Link><span>/</span><Link to="/category">Kategori</Link><span>/</span>{course && <><Link to={`/course/${slug}`}>{course.title}</Link><span>/</span></>}<span aria-current="page">Sertifikat</span></nav>
    {!course ? <h1>Kelas tidak ditemukan</h1> : !progress.complete ? <section className="certificate-card"><h1>Sertifikat belum tersedia</h1><p>Selesaikan semua modul untuk mendapatkan sertifikat.</p><Link className="btn btn-primary" to={`/learn/${slug}`}>Lanjutkan Belajar</Link></section> : <article className="certificate-card">
      <div className="certificate-preview"><img src={image} alt={`Sertifikat ${progress.name} untuk ${course.title}`} /></div>
      <div className="certificate-details"><div><h1>{course.title}</h1><p>{course.description}</p><div className="certificate-instructor"><img src={course.instructorImage} alt="" /><div><strong>{course.instructorName}</strong><small>{course.instructorRole}</small></div></div><div className="certificate-rating"><span aria-hidden="true">★★★☆☆</span><span>{course.rating}</span></div></div>
      <a className="certificate-download" href={image} download={`sertifikat-${slug}.svg`}><span aria-hidden="true">⬇</span> Download Sertifikat</a></div>
    </article>}
  </main><Footer /></div>;
}
