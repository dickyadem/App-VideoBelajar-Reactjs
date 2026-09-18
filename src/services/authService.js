import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

export async function createAccount(name, email, password) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await signOut(auth);
  return credential.user;
}

export async function loginAccount(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutAccount() {
  await signOut(auth);
}

export async function updateAccountProfile(user, displayName) {
  await updateProfile(user, { displayName });
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
