import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const initials = user?.name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase();
  return <header className="site-header"><div className="container header-inner"><Link className="logo" to="/" aria-label="videobelajar Beranda"><img src="/assets/images/logo.png" alt="videobelajar" /></Link><button className="menu-toggle" type="button" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></button><div className={`header-actions${menuOpen ? ' is-open' : ''}`}><Link className="header-link" to="/category" onClick={() => setMenuOpen(false)}>Kategori</Link>{user ? <><span className="avatar" aria-label={`Profil ${user.name}`}>{initials}</span><button className="btn btn-soft" type="button" onClick={() => { logout(); setMenuOpen(false); }}>Keluar</button></> : <><Link className="btn btn-primary" to="/login" onClick={() => setMenuOpen(false)}>Login</Link><Link className="btn btn-soft" to="/register" onClick={() => setMenuOpen(false)}>Register</Link></>}</div></div></header>;
}
