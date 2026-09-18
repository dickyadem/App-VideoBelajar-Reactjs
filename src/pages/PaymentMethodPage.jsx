import { useOrders } from '../context/useOrders';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PaymentMethods from '../components/PaymentMethods';
import { useCatalog } from '../context/CatalogContext';

import { ADMIN_FEE, formatRupiah } from '../data/paymentMethods';
import '../../assets/css/payment-method.css';

function Checkout({ course, detail }) {
  const [selectedPayment, setSelectedPayment] = useState('');
  const content = useRef(null);
  const mounted = useRef(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { orders, createOrder, updateOrder, pending } = useOrders();
  const [error, setError] = useState('');
  const submitOrder = async () => {
    setError('');
    try {
      const existing = orders.find((item) => item.id === searchParams.get('order') && item.slug === course.slug);
      let id;
      if (searchParams.has('order')) { if (!existing) throw new Error('Pesanan tidak ditemukan.'); await updateOrder(existing.id, { method: selectedPayment }); id = existing.id; }
      else id = await createOrder(course, selectedPayment);
      if (mounted.current) navigate('/course/' + course.slug + '/pay?order=' + id + '&method=' + selectedPayment, { state: { orderMessage: 'Pesanan berhasil disimpan.' } });
    } catch { if (mounted.current) setError('Pesanan belum tersimpan. Periksa koneksi lalu coba lagi.'); }
  };
  const isChangingMethod = searchParams.get('change') === '1';
  const total = course.priceAmount + ADMIN_FEE;
  const videoCount = detail.modules.reduce((count, module) => count + module.lessons.length, 0);

  useEffect(() => {
    mounted.current = true;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    return () => { mounted.current = false; };
  }, []);

  return <div className="checkout-page">
    <header className="checkout-header">
      <div className="checkout-desktop-logo"><Link className="logo" to="/" aria-label="videobelajar Beranda"><img src={`${import.meta.env.BASE_URL}assets/images/logo.png`} alt="videobelajar" /></Link></div>
      <div className="checkout-mobile-header"><Header /></div>
      <nav className="checkout-progress" aria-label="Tahapan pembayaran">
        <ol>{['Pilih Metode', 'Bayar', 'Selesai'].map((label, index) => <li key={label}
          className={index === 0 ? 'checkout-step-active' : ''} aria-current={index === 0 ? 'step' : undefined}>
          <span className="checkout-step-circle" aria-hidden="true" />{label}
        </li>)}</ol>
      </nav>
    </header>

    <main className="change-payment-container container" ref={content} tabIndex={-1}>
      <aside className="checkout-panel checkout-course" aria-label="Ringkasan kelas">
        <img className="checkout-course-image" src={course.image} alt={course.imageAlt} />
        <h2>{course.title}</h2>
        <p className="checkout-course-price">{course.price}</p>
        <h3>Kelas Ini Sudah Termasuk</h3>
        <ul className="checkout-features">
          <li><span aria-hidden="true">✓</span> Ujian Akhir</li>
          <li><span aria-hidden="true">▷</span> {videoCount} Video</li>
          <li><span aria-hidden="true">▤</span> {detail.modules.length} Dokumen</li>
          <li><span aria-hidden="true">♧</span> Sertifikat</li>
          <li><span aria-hidden="true">✓</span> Pretest</li>
        </ul>
        <h3>Bahasa Pengantar</h3><p className="checkout-language"><span aria-hidden="true">◎</span> Bahasa Indonesia</p>
      </aside>
      <section className="change-payment-left">
        <section className="checkout-panel shopping-summary-card" aria-labelledby="shopping-title">
          <h2 id="shopping-title">Ringkasan Belanja</h2>
          <div className="summary-row"><span>Total Harga (3 barang)</span><strong>{formatRupiah(course.priceAmount)}</strong></div>
          <div className="summary-row"><span>Ongkos Kirim</span><strong>{formatRupiah(ADMIN_FEE)}</strong></div>
          <div className="summary-total"><span>Total Pembayaran</span><strong>{formatRupiah(total)}</strong></div>
        </section>
        <section className="checkout-panel change-method-card" aria-labelledby="payment-method-title">
          <h1 id="payment-method-title">{isChangingMethod ? 'Ubah Metode Pembayaran' : 'Metode Pembayaran'}</h1>
          <p role="alert">{error}</p><PaymentMethods selectedPayment={selectedPayment} onChange={setSelectedPayment} disabled={pending} />
          {pending && <p role="status">Menyimpan pesanan...</p>}
          <button className="btn btn-primary checkout-action" type="button" disabled={!selectedPayment || pending} onClick={submitOrder}>{isChangingMethod ? 'Bayar Sekarang' : 'Beli Sekarang'}</button>
        </section>
      </section>

    </main>
    <Footer />
  </div>;
}

export default function PaymentMethodPage() {
  const { courses, courseDetails } = useCatalog();
  const { slug } = useParams();
  const course = courses.find((item) => item.slug === slug);
  const detail = course && courseDetails[course.slug];
  if (!course || !detail) return <><Header /><main className="container checkout-not-found">
    <h1>Kelas tidak ditemukan</h1><p>Pilih kelas dari katalog untuk melanjutkan pembelian.</p>
    <Link className="btn btn-primary" to="/category">Jelajahi kelas</Link>
  </main><Footer /></>;
  return <Checkout key={slug} course={course} detail={detail} />;
}
