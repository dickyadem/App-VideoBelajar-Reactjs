import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export async function saveProfile(user) {
  if (!user?.uid || user.uid.includes('/')) throw new Error('Identitas profil tidak valid.');
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    ...(user.photo?.startsWith('https://') ? { photo: user.photo } : {}),
    role: 'student',
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getProfile(userId) {
  if (!userId || userId.includes('/')) throw new Error('Identitas profil tidak valid.');
  const snapshot = await getDoc(doc(db, 'users', userId));
  return snapshot.exists() ? snapshot.data() : {};
}
