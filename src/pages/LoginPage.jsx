import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const destination = /^\/course\/[^/]+\/(?:payment|pay)(?:\?[^#]*)?$/.test(redirectTo ?? '') ? redirectTo : '/';

  return <div className="auth-page"><header className="auth-header"><Link className="logo" to="/" aria-label="videobelajar Beranda"><img src={`${import.meta.env.BASE_URL}assets/images/logo.png`} alt="videobelajar" /></Link></header><AuthForm title="Masuk ke Akun" description={state?.registered ? 'Pendaftaran berhasil! Silakan masuk menggunakan akunmu.' : 'Yuk, lanjutkan belajar dan raih tujuanmu.'} fields={[{ id: 'email', label: 'E-mail', type: 'email', placeholder: 'Masukkan e-mail' }, { id: 'password', label: 'Kata Sandi', type: 'password', placeholder: 'Masukkan kata sandi' }]} submitLabel="Masuk" secondaryLabel="Daftar" secondaryTo="/register" successMessage="Berhasil masuk. Ini adalah simulasi tanpa backend." onSuccess={({ email }) => { login(email.split('@')[0]); navigate(destination, { replace: true }); }} /><p className="auth-switch">Belum punya akun? <Link className="text-link" to="/register">Daftar sekarang</Link></p></div>;
}
