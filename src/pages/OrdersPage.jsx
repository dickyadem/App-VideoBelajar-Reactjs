import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useOrders } from '../context/useOrders';
import { formatRupiah } from '../data/paymentMethods';
import { useCatalog } from '../context/CatalogContext';
import '../../assets/css/orders.css';

const tabs = [
  { id: 'all', label: 'Semua Kelas' },
  { id: 'marketing', label: 'Pemasaran' },
  { id: 'design', label: 'Desain' },
];


function StatusBadge({ status }) {
  return <span className={`order-status order-status-${status.toLowerCase().replace(' ', '-')}`}>{status}</span>;
}

function OrderCard({ order, onDelete }) {
  const { paymentGroups } = useCatalog();
  return <article className="order-card" aria-label={`Pesanan ${order.status}`}>
    <div className="order-card-meta"><Link to={`/course/${order.slug}/pay?order=${order.id}&method=${order.method}`}>No. Invoice: <span>{order.id}</span></Link><time dateTime={order.date}>{new Date(order.date).toLocaleString('id-ID')}</time><StatusBadge status={order.status} /></div>
    <div className="order-card-course"><img src={order.image} alt="" /><h3>{order.title}</h3><div><small>Harga</small><strong>{formatRupiah(order.price)}</strong></div></div>
    <div className="order-card-total"><small>Total Pembayaran</small><strong>{formatRupiah(order.total)}</strong></div>
    <div className="order-crud-actions"><span>{paymentGroups.flatMap((group) => group.options).find((method) => method.id === order.method)?.name}</span>{order.status === 'Belum Bayar' && <><Link to={`/course/${order.slug}/pay?order=${order.id}&method=${order.method}`}>Lanjutkan Pembayaran</Link><Link to={`/course/${order.slug}/payment?change=1&order=${order.id}`}>Ubah Metode</Link><button type="button" onClick={() => onDelete(order.id)}>Hapus Pesanan</button></>}</div>
  </article>;
}

export default function OrdersPage() {
  const { orders, deleteOrder, pending, error: contextError } = useOrders();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const displayError = error || contextError || '';

  async function confirmDelete() {
    setError('');
    setMessage('');
    try {
      await deleteOrder(pendingDelete);
      setPendingDelete(null);
      setMessage('Pesanan berhasil dihapus.');
    } catch {
      setError('Pesanan belum berhasil dihapus. Periksa koneksi lalu coba lagi.');
    }
  }
  const [sort, setSort] = useState('Terbaru');
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');
  const filteredOrders = useMemo(() => orders.filter((order) => {
    const matchesTab = activeTab === 'all' || order.category === activeTab || (activeTab === 'success' && order.status === 'Berhasil') || (activeTab === 'failed' && order.status === 'Gagal');
    const matchesQuery = order.title.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  }).sort((a, b) => sort === 'Terbaru' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)), [orders, activeTab, query, sort]);

  return <><Header /><main className="orders-page container"><aside className="orders-sidebar"><h1>Daftar Pesanan</h1><p>Informasi terperinci mengenai pembelian</p><nav aria-label="Navigasi pesanan"><Link to="/" aria-label="Profil Saya" className="orders-nav-item">♟ <span>Profil Saya</span></Link><Link to="/classes" aria-label="Kelas Saya" className="orders-nav-item">▣ <span>Kelas Saya</span></Link><Link to="/orders" aria-label="Pesanan Saya" className="orders-nav-item is-active">♧ <span>Pesanan Saya</span></Link></nav></aside><section className="orders-content" aria-labelledby="orders-title"><div className="orders-tabs" role="tablist" aria-label="Filter pesanan">{tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}<button type="button" role="tab" aria-selected={activeTab === 'success'} onClick={() => setActiveTab('success')}>Berhasil</button><button type="button" role="tab" aria-selected={activeTab === 'failed'} onClick={() => setActiveTab('failed')}>Gagal</button></div><div className="orders-toolbar"><label className="orders-sort">Urutkan <select aria-label="Urutkan" value={sort} onChange={(event) => setSort(event.target.value)}><option>Terbaru</option><option>Terlama</option></select></label><label className="orders-search"><span className="sr-only">Cari Kelas</span><input type="search" aria-label="Cari Kelas" placeholder="Cari Kelas" value={query} onChange={(event) => setQuery(event.target.value)} /><span aria-hidden="true">⌕</span></label></div><div className="order-list">{filteredOrders.length ? filteredOrders.map((order) => <OrderCard key={order.id} order={order} onDelete={setPendingDelete} />) : <p className="orders-empty">Pesanan tidak ditemukan</p>}</div><p role="alert">{displayError}</p><p role="status">{pending ? 'Menghapus pesanan...' : message}</p>{pendingDelete && <section className="order-delete-confirm" role="dialog" aria-label="Hapus pesanan"><p>Hapus pesanan yang belum dibayar ini?</p><button type="button" disabled={pending} onClick={() => setPendingDelete(null)}>Batal</button><button type="button" disabled={pending} onClick={confirmDelete}>Ya, Hapus</button></section>}</section></main><Footer /></>;
}
