import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
    try { localStorage.setItem(key, JSON.stringify(updated)); setCompleted(updated); setError(''); }
    catch { setError('Progres belum tersimpan di browser.'); }
  }
  return { count, total: ids.length, complete: count === ids.length, completed, markComplete, error, name: user?.name || 'Peserta' };
}
