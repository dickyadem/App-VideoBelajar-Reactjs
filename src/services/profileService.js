import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function saveProfile(user) {
  if (!user?.uid || user.uid.includes('/')) throw new Error('Identitas profil tidak valid.');
  // Explicit fields: never upload passwords, order snapshots, or base64 photos.
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    role: 'student',
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
