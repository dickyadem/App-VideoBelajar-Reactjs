import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';

function authErrorMessage(error) {
  const messages = {
    'auth/invalid-credential': 'Email atau kata sandi salah.',
    'auth/invalid-email': 'Format email tidak valid.',
    'auth/user-disabled': 'Akun ini dinonaktifkan.',
    'auth/email-already-in-use': 'Email sudah terdaftar. Silakan masuk.',
    'auth/weak-password': 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter.',
    'auth/operation-not-allowed': 'Login email belum diaktifkan di Firebase.',
    'auth/network-request-failed': 'Koneksi gagal. Periksa internet lalu coba lagi.',
  };
  return new Error(messages[error?.code] || 'Proses autentikasi gagal. Periksa data lalu coba lagi.');
}

export async function createAccount(name, email, password) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    await signOut(auth);
    return credential.user;
  } catch (error) {
    throw authErrorMessage(error);
  }
}

export async function loginAccount(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  } catch (error) {
    throw authErrorMessage(error);
  }
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
