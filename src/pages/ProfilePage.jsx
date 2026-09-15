import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import '../../assets/css/profile.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || 'dicky.adem@example.com');
  const [phone, setPhone] = useState(user?.phone || '81234567890');
  const [saved, setSaved] = useState(false);
  const [photo, setPhoto] = useState(user?.photo || '');
  const [photoError, setPhotoError] = useState('');
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const photoInput = useRef(null);
  const readerRef = useRef(null);
  const choosePhoto = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    readerRef.current?.abort();
    setLoadingPhoto(false);
    setSaved(false);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setPhotoError('Pilih gambar JPG, PNG, atau WebP.'); return;
    }
    if (file.size > 1024 * 1024) {
      setPhotoError('Ukuran foto maksimal 1 MB.'); return;
    }
    setPhotoError('');
    setLoadingPhoto(true);
    const reader = new FileReader();
    readerRef.current = reader;
    reader.onload = () => { setPhoto(reader.result); setLoadingPhoto(false); };
    reader.onerror = () => { setPhotoError('Foto tidak dapat dibaca. Silakan pilih ulang.'); setLoadingPhoto(false); };
    reader.readAsDataURL(file);
  };
  const save = (event) => {
    event.preventDefault();
    if (loadingPhoto) return;
    const updates = { name, email, phone, photo };
    try { localStorage.setItem('videobelajar-user', JSON.stringify({ ...user, ...updates })); }
    catch { setPhotoError('Profil belum tersimpan. Penyimpanan browser penuh; coba foto lebih kecil.'); setSaved(false); return; }
    updateUser(updates);
    setPhotoError('');
    setSaved(true);
  };
  return <div className="profile-layout"><Header /><main className="profile-page container"><aside className="profile-sidebar"><h1>Ubah Profil</h1><p>Ubah data diri Anda</p><nav aria-label="Navigasi profil"><Link to="/profile" aria-label="Profil Saya" className="profile-nav-item is-active">♟ <span>Profil Saya</span></Link><Link to="/classes" aria-label="Kelas Saya" className="profile-nav-item">▣ <span>Kelas Saya</span></Link><Link to="/orders" aria-label="Pesanan Saya" className="profile-nav-item">♧ <span>Pesanan Saya</span></Link></nav></aside><section className="profile-card" aria-labelledby="profile-title"><div className="profile-heading"><div className="profile-avatar">{photo ? <img src={photo} alt="Pratinjau foto profil" /> : name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</div><div><h2 id="profile-title">{name}</h2><p>{email}</p><button className="profile-photo-action" type="button" onClick={() => photoInput.current.click()}>Ganti Foto Profil</button><input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Pilih foto profil" hidden onChange={choosePhoto} /><small className="profile-photo-hint">JPG, PNG, atau WebP. Maksimal 1 MB.</small>{photoError && <p role="alert">{photoError}</p>}</div></div><form onSubmit={save}><div className="profile-fields"><label>Nama Lengkap<input aria-label="Nama Lengkap" value={name} onChange={(event) => setName(event.target.value)} required /></label><label>E-Mail<input aria-label="E-Mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label className="profile-phone"><span>No. Hp</span><div><select aria-label="Kode negara" defaultValue="+62"><option>+62</option></select><input aria-label="Nomor HP" value={phone} onChange={(event) => setPhone(event.target.value)} /></div></label></div><div className="profile-actions"><p role="status">{saved ? 'Profil berhasil disimpan' : ''}</p><button className="btn btn-primary" type="submit" disabled={loadingPhoto}>Simpan</button></div></form></section></main><Footer /></div>;
}
