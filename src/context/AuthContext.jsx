import { createContext, useContext, useEffect, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AuthContext = createContext(null);
const key = 'videobelajar-user';
const readUser = () => { try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; } };
const createId = () => globalThis.crypto?.randomUUID?.() || `user-${Date.now()}`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  useEffect(() => { if (user) localStorage.setItem(key, JSON.stringify(user)); else localStorage.removeItem(key); }, [user]);
  useEffect(() => {
    if (!user?.uid) return;
    const { orders, isLoggedIn, ...profile } = user;
    setDoc(doc(db, 'users', user.uid), {
      ...profile,
      role: 'student',
      updatedAt: serverTimestamp(),
    }, { merge: true }).catch((error) => console.error('Gagal menyimpan user ke Firestore:', error));
  }, [user]);
  const login = (name, profile = {}) => setUser((current) => ({
    ...current,
    ...profile,
    uid: current?.uid || createId(),
    name,
    isLoggedIn: true,
  }));
  const updateUser = (updates) => setUser((current) => current ? { ...current, ...updates, isLoggedIn: true } : current);
  const logout = () => setUser(null);
  return <AuthContext.Provider value={{ user, login, updateUser, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
