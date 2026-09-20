import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/course-progress.css';

export function ModuleIcon({ completed, children }) {
  return completed
    ? <span className="module-completed-icon" role="img" aria-label="Selesai">✓</span>
    : <span aria-hidden="true">{children}</span>;
}

export { useCourseProgress } from '../hooks/useCourseProgress';

export default function CourseProgress({ progress, course }) {
  const [open, setOpen] = useState(progress.complete);
  const ref = useRef(null);
  const id = useId();
  useEffect(() => { if (progress.complete) setOpen(true); }, [progress.complete]);
  useEffect(() => {
    if (!open) return;
    const outside = (event) => { if (!ref.current?.contains(event.target)) setOpen(false); };
    const escape = (event) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);
  return <div className="course-progress" ref={ref}>
    {progress.complete ? <>
      <button className="certificate-toggle" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}><span aria-hidden="true">🏆</span> Ambil Sertifikat <span aria-hidden="true">⌄</span></button>
      {open && <section className="certificate-popover" id={id} aria-label="Penyelesaian modul">
        <h2>Modul sudah selesai</h2>
        <p>{progress.count} dari {progress.total} modul telah selesai, silakan download sertifikat</p>
        <Link to={`/course/${course?.slug}/certificate`}>Ambil Sertifikat</Link>
      </section>}
    </> : <>
      <button type="button" className="course-progress-count" aria-label={`Lihat progres modul: ${progress.count}/${progress.total}`} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}><progress value={progress.count} max={progress.total} aria-label="Progres modul" /><b>{progress.count}/{progress.total}</b><span aria-hidden="true">⌄</span></button>
      {open && <section className="certificate-popover" id={id} aria-label="Progres kelas">
        <h2>{Math.round(progress.count / progress.total * 100)}% Modul Telah Selesai</h2>
        <p>Selesaikan Semua Modul Untuk Mendapatkan Sertifikat</p>
        <small>{progress.count} dari {progress.total} modul selesai</small>
      </section>}
    </>}
    {progress.error && <span role="alert">{progress.error}</span>}
  </div>;
}
