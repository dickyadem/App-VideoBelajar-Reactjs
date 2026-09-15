import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth(); const navigate = useNavigate();
  return <div className="auth-page"><header className="auth-header"><Link className="logo" to="/" aria-label="videobelajar Beranda"><img src="/assets/images/logo.png" alt="videobelajar" /></Link></header><AuthForm title="Masuk ke Akun" description="Yuk, lanjutkan belajar dan raih tujuanmu." fields={[{ id: 'email', label: 'E-mail', type: 'email', placeholder: 'Masukkan e-mail' }, { id: 'password', label: 'Kata Sandi', type: 'password', placeholder: 'Masukkan kata sandi' }]} submitLabel="Masuk" secondaryLabel="Daftar" secondaryTo="/register" successMessage="Berhasil masuk. Ini adalah simulasi tanpa backend." onSuccess={({ email }) => { login(email.split('@')[0]); navigate('/'); }} /><p className="auth-switch">Belum punya akun? <Link className="text-link" to="/register">Daftar sekarang</Link></p></div>;
}
