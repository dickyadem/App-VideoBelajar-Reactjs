import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function progressReference(userId, slug) {
  return doc(db, 'users', userId, 'progress', slug);
}

export async function getProgress(userId, slug) {
  if (!userId || !slug) return [];
  const snapshot = await getDoc(progressReference(userId, slug));
  const completed = snapshot.exists() ? snapshot.data().completed : [];
  return Array.isArray(completed) ? completed : [];
}

export async function saveProgress(userId, slug, completed) {
  if (!userId || !slug) return;
  await setDoc(progressReference(userId, slug), { completed, updatedAt: serverTimestamp() }, { merge: true });
}
