import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile, saveProfile } from '../services/api/profileService';
import { createAccount, loginAccount, logoutAccount, subscribeToAuth, updateAccountProfile } from '../services/api/authService';
import { auth } from '../firebase';

const AuthContext = createContext(null);
const key = 'videobelajar-user';
const profileFromFirebaseUser = (firebaseUser) => firebaseUser && ({ uid: firebaseUser.uid, name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Peserta', email: firebaseUser.email || '', isLoggedIn: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('');
  const [syncError, setSyncError] = useState('');
  const [storageError, setStorageError] = useState('');
  const [syncAttempt, setSyncAttempt] = useState(0);
  useEffect(() => subscribeToAuth((firebaseUser) => {
    if (!firebaseUser) { setUser(null); setAuthLoading(false); return; }
    getProfile(firebaseUser.uid).then((profile) => setUser({ ...profileFromFirebaseUser(firebaseUser), ...profile, uid: firebaseUser.uid, isLoggedIn: true }))
      .catch(() => setUser(profileFromFirebaseUser(firebaseUser)))
      .finally(() => setAuthLoading(false));
  }), []);
  useEffect(() => {
    try {
      if (user) localStorage.setItem(key, JSON.stringify(user));
      else localStorage.removeItem(key);
      setStorageError('');
    } catch { setStorageError('Sesi belum tersimpan di browser. Periksa ruang penyimpanan dan izin browser.'); }
  }, [user]);
  useEffect(() => {
    let active = true;
    setSyncError('');
    setSyncStatus('');
    if (!user?.uid || !user.isLoggedIn) return;
    setSyncStatus('pending');
    saveProfile(user).then(() => {
      if (active) setSyncStatus('saved');
    }).catch(() => {
      if (active) {
        setSyncStatus('');
        setSyncError('Profil belum tersinkron ke Firebase. Silakan coba lagi.');
      }
    });
    return () => { active = false; };
  }, [user, syncAttempt]);
  const login = async (email, password) => loginAccount(email, password);
  const register = async (name, email, password) => createAccount(name, email, password);
  const updateUser = async (updates) => {
    if (!user) return;
    if (updates.name && updates.name !== user.name) await updateAccountProfile(auth.currentUser, updates.name);
    setUser((current) => current && { ...current, ...updates });
  };
  const logout = () => logoutAccount();
  return <AuthContext.Provider value={{ user, authLoading, login, register, updateUser, logout, syncStatus, syncError, storageError, retrySync: () => setSyncAttempt((value) => value + 1) }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
