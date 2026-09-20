import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProgress, saveProgress } from '../services/api/progressService';

export function useCourseProgress(slug, detail) {
  const { user } = useAuth();
  const key = `videobelajar-progress:${user?.uid}:${slug}`;
  const ids = ['pretest', ...(detail?.modules.flatMap((module) => module.lessons.map((lesson) => lesson.title)) || []), 'summary', 'quiz', 'exam'];
  const [completed, setCompleted] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(key)); return Array.isArray(saved) ? saved : []; } catch { return []; }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(Boolean(user?.uid && detail));
  useEffect(() => {
    let active = true;
    if (!user?.uid || !detail) return undefined;
    setLoading(true);
    getProgress(user.uid, slug).then((saved) => {
      if (active) { setCompleted(saved); localStorage.setItem(key, JSON.stringify(saved)); }
    }).catch(() => { if (active) setError('Progres Firebase belum termuat. Progres lokal tetap digunakan.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user?.uid, slug, detail, key]);
  const count = ids.filter((id) => completed.includes(id)).length;
  async function markComplete(id) {
    if (!ids.includes(id) || completed.includes(id)) return;
    const updated = [...completed, id];
    try { await saveProgress(user?.uid, slug, updated); localStorage.setItem(key, JSON.stringify(updated)); setCompleted(updated); setError(''); }
    catch { setError('Progres belum tersimpan di browser.'); }
  }
  return { count, total: ids.length, complete: count === ids.length, completed, markComplete, error, loading, name: user?.name || 'Peserta' };
}
