import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../../assets/css/course-progress.css';

export function ModuleIcon({ completed, children }) {
  return completed
    ? <span className="module-completed-icon" role="img" aria-label="Selesai">✓</span>
    : <span aria-hidden="true">{children}</span>;
}

export function useCourseProgress(slug, detail) {
  const { user } = useAuth();
  const key = `videobelajar-progress:${user?.name}:${slug}`;
  const ids = ['pretest', ...(detail?.modules.flatMap((module) => module.lessons.map((lesson) => lesson.title)) || []), 'summary', 'quiz', 'exam'];
  const [completed, setCompleted] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(key)); return Array.isArray(saved) ? saved : []; } catch { return []; }
  });
  const [error, setError] = useState('');
  const count = ids.filter((id) => completed.includes(id)).length;
  function markComplete(id) {
    if (!ids.includes(id) || completed.includes(id)) return;
    const updated = [...completed, id];
    setCompleted(updated);
    try { localStorage.setItem(key, JSON.stringify(updated)); setError(''); }
    catch { setError('Progres belum tersimpan di browser.'); }
  }
  return { count, total: ids.length, complete: count === ids.length, completed, markComplete, error, name: user?.name || 'Peserta' };
}

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
    </> : <div className="course-progress-count"><progress value={progress.count} max={progress.total} aria-label="Progres modul" /><b>{progress.count}/{progress.total}</b></div>}
    {progress.error && <span role="alert">{progress.error}</span>}
  </div>;
}
