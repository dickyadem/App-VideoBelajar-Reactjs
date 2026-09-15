import paymentSuccessImage from '../../assets/images/information-image/pembayaranSukses.webp';
import paymentPendingImage from '../../assets/images/information-image/pembayaranTertunda.webp';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { courses } from '../data/courses';
import { courseDetails } from '../data/courseDetails';
import { ADMIN_FEE, formatRupiah, paymentGroups, paymentLogos } from '../data/paymentMethods';
import '../../assets/css/payment-page.css';

const instructions = [
  ['ATM BCA', ['Masukkan kartu ATM dan PIN BCA Anda.', 'Di menu utama, pilih "Transaksi Lainnya" lalu "Transfer" dan "Ke BCA Virtual Account".', 'Masukkan nomor Virtual Account.', 'Pastikan data Virtual Account benar, kemudian masukkan nominal pembayaran dan pilih "Benar".', 'Periksa konfirmasi pembayaran. Pilih "Ya" jika benar atau "Tidak" jika data masih salah.', 'Transaksi selesai. Pilih "Tidak" untuk tidak melanjutkan transaksi lain.']],
  ['Mobile Banking BCA', ['Buka aplikasi BCA Mobile.', 'Pilih "m-BCA", kemudian "m-Transfer".', 'Pilih "BCA Virtual Account".', 'Masukkan nomor Virtual Account lalu pilih "OK".', 'Klik tombol "Send" di kanan atas aplikasi.', 'Klik "OK" untuk melanjutkan pembayaran.', 'Masukkan PIN untuk mengotorisasi transaksi.', 'Transaksi selesai.']],
  ['Internet Banking BCA', ['Login ke KlikBCA Individual.', 'Pilih "Transfer", lalu "Transfer ke BCA Virtual Account".', 'Masukkan nomor Virtual Account.', 'Pilih "Lanjutkan".', 'Masukkan "RESPON KEYBCA APPLI 1" dari Token BCA lalu klik "Kirim".', 'Pembayaran selesai.']],
];

function Countdown() {
  const [remaining, setRemaining] = useState(3055);
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  return <div className="payment-countdown" role="status">Selesaikan pemesanan dalam <span className="timer-box">{String(hours).padStart(2, '0')}</span> : <span className="timer-box">{String(minutes).padStart(2, '0')}</span> : <span className="timer-box">{String(seconds).padStart(2, '0')}</span></div>;
}

function Stepper({ complete }) {
  return <nav className="payment-stepper" aria-label="Tahapan pembayaran"><ol>{['Pilih Metode', 'Bayar', 'Selesai'].map((label, index) => <li className={index < 1 || (complete && index < 3) ? 'is-complete' : index === 1 ? 'is-active' : ''} aria-current={(!complete && index === 1) || (complete && index === 2) ? 'step' : undefined} key={label}><span aria-hidden="true">{index === 0 || (complete && index < 2) ? '✓' : ''}</span>{label}</li>)}</ol></nav>;
}

function Instructions() {
  const [open, setOpen] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? -1 : 0));
  return <section className="payment-instruction-card" aria-labelledby="instructions-title"><h2 id="instructions-title">Tata Cara Pembayaran</h2>{instructions.map(([title, steps], index) => <div className="instruction-item" key={title}><button className="instruction-header" type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? -1 : index)}>{title}<span aria-hidden="true">{open === index ? '^' : 'v'}</span></button>{open === index && <ol className="instruction-body">{steps.map((step) => <li key={step}>{step}</li>)}</ol>}</div>)}</section>;
}

function CourseSummary({ course, detail }) {
  const videoCount = detail.modules.reduce((total, module) => total + module.lessons.length, 0);
  return <aside className="course-summary-card" aria-label="Ringkasan kelas"><img className="course-image" src={course.image} alt={course.imageAlt} /><h2 className="course-title">{course.title}</h2><div className="course-price-row"><strong className="course-price">{course.price}</strong></div><h3>Kelas Ini Sudah Termasuk</h3><ul className="course-features"><li>✓ Ujian Akhir</li><li>▷ {videoCount} Video</li><li>▤ {detail.modules.length} Dokumen</li><li>♧ Sertifikat</li><li>✓ Pretest</li></ul><h3>Bahasa Pengantar</h3><p>◎ Bahasa Indonesia</p></aside>;
}

function PaymentResult({ course, status }) {
  const pending = status === 'pending';
  return <section className={`payment-result ${pending ? 'is-pending' : 'is-success'}`} aria-labelledby="result-title">
    <img className="payment-result-image" src={pending ? paymentPendingImage : paymentSuccessImage} alt="" />
    <h1 id="result-title">{pending ? 'Pembayaran Tertunda' : 'Pembayaran Berhasil'}!</h1>
    <p>Silakan cek email kamu untuk informasi lebih lanjut. Hubungi kami jika ada kendala.</p>
    <Link className="btn btn-primary" to="/orders">Lihat Detail Pesanan</Link>
  </section>;
}

function PaymentPageContent({ course, detail, method, initialStatus = '' }) {
  const navigate = useNavigate();
  const [resultStatus, setResultStatus] = useState(initialStatus);
  const complete = Boolean(resultStatus);
  const [copied, setCopied] = useState(false);
  const total = course.priceAmount + ADMIN_FEE;
  const virtualAccount = '11739081234567890';
  const copyAccount = async () => { try { await navigator.clipboard.writeText(virtualAccount); } catch {} setCopied(true); };
  return <div className="payment-page"><header className="payment-header"><Link className="logo" to="/" aria-label="videobelajar Beranda"><img src="/assets/images/logo.png" alt="videobelajar" /></Link><div className="payment-header-mobile"><Header /></div><div className="payment-stepper-desktop"><Stepper complete={complete} /></div></header>{!complete && <Countdown />}<div className="payment-stepper-mobile"><Stepper complete={complete} /></div><main className="payment-container container">{complete ? <PaymentResult course={course} status={resultStatus} /> : <div className="payment-layout"><section><div className="payment-main-card"><h1 className="payment-title">Pembayaran</h1><div className="virtual-account-box"><div className="payment-provider-logos">{(method.brands || [method.id]).map((brand) => <img key={brand} src={paymentLogos[brand.toLowerCase()]} alt={method.brands ? brand : method.name} />)}</div><p className="payment-method-label">Bayar Melalui Virtual Account <strong>{method.name}</strong></p><div className="virtual-account-number"><span>{virtualAccount}</span><button className="copy-button" type="button" onClick={copyAccount}>{copied ? 'Tersalin' : 'Salin'}</button></div></div><section className="order-summary" aria-labelledby="order-title"><h2 id="order-title">Ringkasan Pesanan</h2><div className="order-row"><span className="order-label">Video Learning: {course.title}</span><span className="order-price">{formatRupiah(course.priceAmount)}</span></div><div className="order-row"><span className="order-label">Biaya Admin</span><span className="order-price">{formatRupiah(ADMIN_FEE)}</span></div><div className="order-total"><span>Total Pembayaran</span><strong className="total-value">{formatRupiah(total)}</strong></div></section><div className="payment-actions"><button className="btn-change-payment" type="button" onClick={() => navigate(`/course/${course.slug}/payment?change=1`)}>Ganti Metode Pembayaran</button><button className="btn-pay-now" type="button" onClick={() => setResultStatus('success')}>Bayar Sekarang</button></div><p className="payment-demo">Mode demo - belum ada transaksi atau akses materi.</p></div><Instructions /></section><CourseSummary course={course} detail={detail} /></div>}</main><Footer /></div>;
}

export default function PaymentPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const course = courses.find((item) => item.slug === slug);
  const detail = course && courseDetails[course.slug];
  const method = paymentGroups.flatMap((group) => group.options).find((item) => item.id === searchParams.get('method')) || paymentGroups[0].options[0];
  if (!course || !detail) return <><Header /><main className="container checkout-not-found"><h1>Kelas tidak ditemukan</h1><Link className="btn btn-primary" to="/category">Jelajahi kelas</Link></main><Footer /></>;
  const status = searchParams.get('status') === 'pending' ? 'pending' : searchParams.get('status') === 'success' || searchParams.get('complete') === '1' ? 'success' : '';
  return <PaymentPageContent key={`${slug}-${method.id}-${status}`} course={course} detail={detail} method={method} initialStatus={status} />;
}
