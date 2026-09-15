import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
const key = 'videobelajar-user';
const readUser = () => { try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; } };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  useEffect(() => { if (user) localStorage.setItem(key, JSON.stringify(user)); else localStorage.removeItem(key); }, [user]);
  const login = (name) => setUser({ name, isLoggedIn: true });
  const logout = () => setUser(null);
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
