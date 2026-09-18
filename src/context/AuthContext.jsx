import { createContext, useContext, useEffect, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AuthContext = createContext(null);
const key = 'videobelajar-user';
const createId = () => globalThis.crypto?.randomUUID?.() || `user-${Date.now()}`;
const identityKey = (profile) => `${profile.email ? 'email' : 'name'}:${(profile.email || profile.name || '').trim().toLowerCase()}`;

// Demo identities persist on this browser; this is not Firebase Authentication.
function demoUid(profile) {
  let identities = {};
  try { identities = JSON.parse(localStorage.getItem('videobelajar-demo-identities')) || {}; } catch {}
  const identity = identityKey(profile);
  const uid = profile.uid || identities[identity] || createId();
  try { localStorage.setItem('videobelajar-demo-identities', JSON.stringify({ ...identities, [identity]: uid })); } catch {}
  return uid;
}

const readUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem(key));
    return user ? { ...user, uid: demoUid(user) } : null;
  } catch { return null; }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  useEffect(() => { if (user) localStorage.setItem(key, JSON.stringify(user)); else localStorage.removeItem(key); }, [user]);
  useEffect(() => {
    if (!user?.uid || !user.isLoggedIn) return;
    const { orders, isLoggedIn, ...profile } = user;
    setDoc(doc(db, 'users', user.uid), {
      ...profile,
      role: 'student',
      updatedAt: serverTimestamp(),
    }, { merge: true }).catch((error) => console.error('Gagal menyimpan user ke Firestore:', error));
  }, [user]);
  const login = (name, profile = {}) => setUser((current) => {
    const next = { ...(current && identityKey(current) === identityKey({ name, ...profile }) ? current : {}), ...profile, name, isLoggedIn: true };
    return { ...next, uid: demoUid(next) };
  });
  const updateUser = (updates) => setUser((current) => {
    if (!current) return current;
    const next = { ...current, ...updates, isLoggedIn: true };
    return { ...next, uid: demoUid(next) };
  });
  const logout = () => setUser(null);
  return <AuthContext.Provider value={{ user, login, updateUser, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
