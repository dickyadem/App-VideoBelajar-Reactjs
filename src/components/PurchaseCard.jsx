import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PurchaseCard({ course, modules }) {
  const [message, setMessage] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const videoCount = modules.reduce((total, section) => total + section.lessons.length, 0);

  async function share() {
    const url = new URL(`/course/${course.slug}`, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setShareUrl('');
      setMessage('Tautan kelas berhasil disalin.');
    } catch {
      setShareUrl(url);
      setMessage('Salin tautan berikut untuk membagikan kelas.');
    }
  }

  return (
    <aside className="detail-panel purchase-card" aria-label="Informasi pembelian">
      <h2>{course.title}</h2>
      <p className="detail-price">{course.price}</p>
      <p className="purchase-note">Belajar sesuai ritmemu, kapan pun dan di mana pun.</p>
      <Link className="btn btn-primary" to={`/course/${course.slug}/payment`}>Beli Sekarang</Link>
      <button className="btn detail-outline" type="button" onClick={share}>Bagikan Kelas</button>
      <p className="purchase-feedback" role="status">{message}</p>
      {shareUrl && <label className="share-field">Tautan kelas<input value={shareUrl} readOnly onFocus={(event) => event.target.select()} /></label>}
      <h3>Kelas Ini Sudah Termasuk</h3>
      <ul className="course-inclusions">
        <li><span aria-hidden="true">✓</span> Ujian Akhir</li>
        <li><span aria-hidden="true">▷</span> {videoCount} Video</li>
        <li><span aria-hidden="true">▤</span> {modules.length} Dokumen</li>
        <li><span aria-hidden="true">♧</span> Sertifikat</li>
        <li><span aria-hidden="true">✓</span> Pretest</li>
      </ul>
      <h3>Bahasa Pengantar</h3>
      <p className="detail-muted">Bahasa Indonesia</p>
      <p className="detail-demo-note">Pratinjau kelas demo. Video, dokumen, ujian, dan sertifikat belum tersedia.</p>
    </aside>
  );
}
