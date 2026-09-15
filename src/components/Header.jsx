import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const initials = user?.name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase();
  const closeMenus = () => { setMenuOpen(false); setProfileOpen(false); };
  const toggleMenu = () => { const nextOpen = !menuOpen; setMenuOpen(nextOpen); setProfileOpen(nextOpen); };
  return <header className="site-header"><div className="container header-inner"><Link className="logo" to="/" aria-label="videobelajar Beranda"><img src={`${import.meta.env.BASE_URL}assets/images/logo.png`} alt="videobelajar" /></Link><button className="menu-toggle" type="button" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} onClick={toggleMenu}><span /><span /><span /></button><div className={`header-actions${menuOpen ? ' is-open' : ''}`}><Link className="header-link" to="/category" onClick={closeMenus}>Kategori</Link>{user ? <div className="profile-menu"><button className="avatar avatar-button" type="button" aria-label={`${profileOpen ? 'Tutup' : 'Buka'} menu profil ${user.name}`} aria-expanded={profileOpen} onClick={() => setProfileOpen(!profileOpen)}>{user.photo ? <img className="user-avatar-photo" src={user.photo} alt={`Foto profil ${user.name}`} /> : initials}</button>{profileOpen && <div className="profile-dropdown"><Link to="/profile" onClick={closeMenus}>Profil Saya</Link><Link to="/classes" onClick={closeMenus}>Kelas Saya</Link><Link to="/orders" onClick={closeMenus}>Pesanan Saya</Link><button type="button" onClick={() => { logout(); closeMenus(); }}>Keluar <span aria-hidden="true">↪</span></button></div>}</div> : <><Link className="btn btn-primary" to="/login" onClick={closeMenus}>Login</Link><Link className="btn btn-soft" to="/register" onClick={closeMenus}>Register</Link></>}</div></div></header>;
}
