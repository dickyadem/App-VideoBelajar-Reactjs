import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileSyncStatus from '../components/ProfileSyncStatus';
import { useAuth } from '../context/AuthContext';
import { uploadProfilePhoto } from '../services/api/cloudinaryService';
import '../../assets/css/profile.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || 'dicky.adem@example.com');
  const [phone, setPhone] = useState(user?.phone || '81234567890');
  const [saved, setSaved] = useState(false);
  const [photo, setPhoto] = useState(user?.photo || '');
  const [photoFailed, setPhotoFailed] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const photoInput = useRef(null);
  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setPhoto(user?.photo || '');
    setPhotoFailed(false);
  }, [user]);
  const choosePhoto = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
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
    uploadProfilePhoto(file).then((url) => setPhoto(url)).catch(() => setPhotoError('Foto belum berhasil diunggah. Silakan coba lagi.')).finally(() => setLoadingPhoto(false));
  };
  const save = async (event) => {
    event.preventDefault();
    if (loadingPhoto) return;
    const updates = { name, email, phone, photo };
    try { await updateUser(updates); setPhotoError(''); setSaved(true); }
    catch { setPhotoError('Profil belum tersimpan. Silakan coba lagi.'); setSaved(false); }
  };
  return <div className="profile-layout"><Header /><main className="profile-page container"><aside className="profile-sidebar"><h1>Ubah Profil</h1><p>Ubah data diri Anda</p><nav aria-label="Navigasi profil"><Link to="/profile" aria-label="Profil Saya" className="profile-nav-item is-active">♟ <span>Profil Saya</span></Link><Link to="/classes" aria-label="Kelas Saya" className="profile-nav-item">▣ <span>Kelas Saya</span></Link><Link to="/orders" aria-label="Pesanan Saya" className="profile-nav-item">♧ <span>Pesanan Saya</span></Link></nav></aside><section className="profile-card" aria-labelledby="profile-title"><div className="profile-heading"><div className="profile-avatar">{photo && !photoFailed ? <img src={photo} alt="Pratinjau foto profil" onError={() => setPhotoFailed(true)} /> : name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</div><div><h2 id="profile-title">{name}</h2><p>{email}</p><button className="profile-photo-action" type="button" onClick={() => photoInput.current.click()}>Ganti Foto Profil</button><input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Pilih foto profil" hidden onChange={choosePhoto} /><small className="profile-photo-hint">JPG, PNG, atau WebP. Maksimal 1 MB.</small>{photoError && <p role="alert">{photoError}</p>}</div></div><p>Foto profil disimpan di browser ini.</p><ProfileSyncStatus /><form onSubmit={save}><div className="profile-fields"><label>Nama Lengkap<input aria-label="Nama Lengkap" value={name} onChange={(event) => setName(event.target.value)} required /></label><label>E-Mail<input aria-label="E-Mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label className="profile-phone"><span>No. Hp</span><div><select aria-label="Kode negara" defaultValue="+62"><option>+62</option></select><input aria-label="Nomor HP" value={phone} onChange={(event) => setPhone(event.target.value)} /></div></label></div><div className="profile-actions"><p role="status">{saved ? 'Profil berhasil disimpan' : ''}</p><button className="btn btn-primary" type="submit" disabled={loadingPhoto}>Simpan</button></div></form></section></main><Footer /></div>;
}
