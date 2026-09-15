import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { courses } from '../data/courses';
import '../../assets/css/orders.css';

const tabs = [
  { id: 'all', label: 'Semua Kelas' },
  { id: 'marketing', label: 'Pemasaran' },
  { id: 'design', label: 'Desain' },
];
const orders = [
  { status: 'Berhasil', category: 'design' },
  { status: 'Gagal', category: 'design' },
  { status: 'Belum Bayar', category: 'marketing' },
  { status: 'Berhasil', category: 'design' },
  { status: 'Berhasil', category: 'marketing' },
].map((order, index) => ({
  ...order,
  id: `HEL/V1/10062023-${index + 1}`,
  date: '10 Juni 2023, 14.17',
  course: courses[0],
  price: 300000,
}));

function StatusBadge({ status }) {
  return <span className={`order-status order-status-${status.toLowerCase().replace(' ', '-')}`}>{status}</span>;
}

function OrderCard({ order }) {
  return <article className="order-card" aria-label={`Pesanan ${order.status}`}>
    <div className="order-card-meta"><a href="#invoice">No. Invoice: <span>{order.id}</span></a><time>{order.date}</time><StatusBadge status={order.status} /></div>
    <div className="order-card-course"><img src={order.course.image} alt="" /><h3>Belajar Microsoft Office dan Google Workspace untuk Pemula</h3><div><small>Harga</small><strong>Rp 300.000</strong></div></div>
    <div className="order-card-total"><small>Total Pembayaran</small><strong>Rp 300.000</strong></div>
  </article>;
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');
  const filteredOrders = useMemo(() => orders.filter((order) => {
    const matchesTab = activeTab === 'all' || order.category === activeTab || (activeTab === 'success' && order.status === 'Berhasil') || (activeTab === 'failed' && order.status === 'Gagal');
    const matchesQuery = 'Belajar Microsoft Office dan Google Workspace untuk Pemula'.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  }), [activeTab, query]);

  return <><Header /><main className="orders-page container"><aside className="orders-sidebar"><h1>Daftar Pesanan</h1><p>Informasi terperinci mengenai pembelian</p><nav aria-label="Navigasi pesanan"><Link to="/" aria-label="Profil Saya" className="orders-nav-item">♟ <span>Profil Saya</span></Link><Link to="/classes" aria-label="Kelas Saya" className="orders-nav-item">▣ <span>Kelas Saya</span></Link><Link to="/orders" aria-label="Pesanan Saya" className="orders-nav-item is-active">♧ <span>Pesanan Saya</span></Link></nav></aside><section className="orders-content" aria-labelledby="orders-title"><div className="orders-tabs" role="tablist" aria-label="Filter pesanan">{tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}<button type="button" role="tab" aria-selected={activeTab === 'success'} onClick={() => setActiveTab('success')}>Berhasil</button><button type="button" role="tab" aria-selected={activeTab === 'failed'} onClick={() => setActiveTab('failed')}>Gagal</button></div><div className="orders-toolbar"><label className="orders-sort">Urutkan <select aria-label="Urutkan"><option>Terbaru</option><option>Terlama</option></select></label><label className="orders-search"><span className="sr-only">Cari Kelas</span><input type="search" aria-label="Cari Kelas" placeholder="Cari Kelas" value={query} onChange={(event) => setQuery(event.target.value)} /><span aria-hidden="true">⌕</span></label></div><div className="order-list">{filteredOrders.length ? filteredOrders.map((order) => <OrderCard key={order.id} order={order} />) : <p className="orders-empty">Pesanan tidak ditemukan</p>}</div><nav className="orders-pagination" aria-label="Paginasi pesanan"><button type="button" aria-label="Halaman sebelumnya">‹</button><button type="button" aria-current="page">1</button><button type="button">2</button><button type="button">3</button><button type="button" aria-label="Halaman berikutnya">›</button></nav></section></main><Footer /></>;
}
