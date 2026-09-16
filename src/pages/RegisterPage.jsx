import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';


export default function RegisterPage() {
  const navigate = useNavigate();
  return <div className="auth-page"><header className="auth-header"><Link className="logo" to="/" aria-label="videobelajar Beranda"><img src={`${import.meta.env.BASE_URL}assets/images/logo.png`} alt="videobelajar" /></Link></header><AuthForm title="Pendaftaran Akun" description="Mulai perjalanan belajar bersama videobelajar." fields={[{ id: 'name', label: 'Nama', type: 'text', placeholder: 'Masukkan nama lengkap' }, { id: 'email', label: 'E-mail', type: 'email', placeholder: 'Masukkan e-mail' }, { id: 'phone', label: 'Nomor HP', type: 'tel', placeholder: '812 3456 7890' }, { id: 'password', label: 'Kata Sandi', type: 'password', placeholder: 'Minimal 6 karakter' }, { id: 'confirmation', label: 'Konfirmasi Kata Sandi', type: 'password', placeholder: 'Ulangi kata sandi' }]} submitLabel="Daftar" secondaryLabel="Masuk" secondaryTo="/login" successMessage="Akun berhasil dibuat. Ini adalah simulasi tanpa backend." requiresConfirmation onSuccess={() => navigate('/login', { replace: true, state: { registered: true } })} /><p className="auth-switch">Sudah punya akun? <Link className="text-link" to="/login">Masuk sekarang</Link></p></div>;
}
