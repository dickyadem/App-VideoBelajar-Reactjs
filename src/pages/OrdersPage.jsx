import { useEffect, useMemo, useRef, useState } from 'react';
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
  return (
    <span className={`order-status order-status-${status.toLowerCase().replace(' ', '-')}`}>
      {status}
    </span>
  );
}

function OrderCard({ order, onDelete }) {
  const { paymentGroups } = useCatalog();
  return (
    <article className="order-card" aria-label={`Pesanan ${order.status}`}>
      <div className="order-card-meta">
        <Link to={`/course/${order.slug}/pay?order=${order.id}&method=${order.method}`}>
          No. Invoice: <span>{order.id}</span>
        </Link>
        <time dateTime={order.date}>{new Date(order.date).toLocaleString('id-ID')}</time>
        <StatusBadge status={order.status} />
      </div>
      <div className="order-card-course">
        <img src={order.image} alt="" />
        <h3>{order.title}</h3>
        <div>
          <small>Harga</small>
          <strong>{formatRupiah(order.price)}</strong>
        </div>
      </div>
      <div className="order-card-total">
        <small>Total Pembayaran</small>
        <strong>{formatRupiah(order.total)}</strong>
      </div>
      <div className="order-crud-actions">
        <span>
          {paymentGroups
            .flatMap((group) => group.options)
            .find((method) => method.id === order.method)?.name}
        </span>
        {order.status === 'Belum Bayar' && (
          <>
            <Link to={`/course/${order.slug}/pay?order=${order.id}&method=${order.method}`}>
              Lanjutkan Pembayaran
            </Link>
            <Link to={`/course/${order.slug}/payment?change=1&order=${order.id}`}>
              Ubah Metode
            </Link>
            <button type="button" onClick={() => onDelete(order.id)}>
              Hapus Pesanan
            </button>
          </>
        )}
      </div>
    </article>
  );
}

function DeleteConfirmModal({ pending, onCancel, onConfirm }) {
  const cancelRef = useRef(null);

  // Fokus otomatis ke tombol Batal saat modal muncul
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  // Tutup dengan tombol Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && !pending) onCancel();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [pending, onCancel]);

  // Kunci scroll body selama modal terbuka
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !pending) onCancel();
      }}
    >
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-desc"
      >
        <h2 id="delete-modal-title" className="modal-title">
          Hapus Pesanan
        </h2>
        <p id="delete-modal-desc" className="modal-desc">
          Hapus pesanan yang belum dibayar ini? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="modal-actions">
          <button
            type="button"
            ref={cancelRef}
            className="btn btn-secondary"
            disabled={pending}
            onClick={onCancel}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn-danger"
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ type = 'success', message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`toast toast-${type}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <span className="toast-icon" aria-hidden="true">
        {type === 'success' ? '✓' : '!'}
      </span>
      <span className="toast-message">{message}</span>
      <button
        type="button"
        className="toast-close"
        aria-label="Tutup"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}

export default function OrdersPage() {
  const { orders, deleteOrder, pending, error: contextError } = useOrders();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null); // { type, message }
  const displayError = error || contextError || '';

  async function confirmDelete() {
    setError('');
    setToast(null);
    try {
      await deleteOrder(pendingDelete);
      setPendingDelete(null);
      setToast({ type: 'success', message: 'Pesanan berhasil dihapus.' });
    } catch {
      setPendingDelete(null);
      setToast({
        type: 'error',
        message: 'Pesanan belum berhasil dihapus. Periksa koneksi lalu coba lagi.',
      });
    }
  }

  const [sort, setSort] = useState('Terbaru');
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');

  const filteredOrders = useMemo(
    () =>
      orders
        .filter((order) => {
          const matchesTab =
            activeTab === 'all' ||
            order.category === activeTab ||
            (activeTab === 'success' && order.status === 'Berhasil') ||
            (activeTab === 'failed' && order.status === 'Gagal');
          const matchesQuery = order.title.toLowerCase().includes(query.toLowerCase());
          return matchesTab && matchesQuery;
        })
        .sort((a, b) =>
          sort === 'Terbaru' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
        ),
    [orders, activeTab, query, sort]
  );

  return (
    <>
      <Header />
      <main className="orders-page container">
        <aside className="orders-sidebar">
          <h1>Daftar Pesanan</h1>
          <p>Informasi terperinci mengenai pembelian</p>
          <nav aria-label="Navigasi pesanan">
            <Link to="/" aria-label="Profil Saya" className="orders-nav-item">
              ♟ <span>Profil Saya</span>
            </Link>
            <Link to="/classes" aria-label="Kelas Saya" className="orders-nav-item">
              ▣ <span>Kelas Saya</span>
            </Link>
            <Link to="/orders" aria-label="Pesanan Saya" className="orders-nav-item is-active">
              ♧ <span>Pesanan Saya</span>
            </Link>
          </nav>
        </aside>

        <section className="orders-content" aria-labelledby="orders-title">
          <div className="orders-tabs" role="tablist" aria-label="Filter pesanan">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'success'}
              onClick={() => setActiveTab('success')}
            >
              Berhasil
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'failed'}
              onClick={() => setActiveTab('failed')}
            >
              Gagal
            </button>
          </div>

          <div className="orders-toolbar">
            <label className="orders-sort">
              Urutkan{' '}
              <select
                aria-label="Urutkan"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option>Terbaru</option>
                <option>Terlama</option>
              </select>
            </label>
            <label className="orders-search">
              <span className="sr-only">Cari Kelas</span>
              <input
                type="search"
                aria-label="Cari Kelas"
                placeholder="Cari Kelas"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <span aria-hidden="true">⌕</span>
            </label>
          </div>

          <div className="order-list">
            {filteredOrders.length ? (
              filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} onDelete={setPendingDelete} />
              ))
            ) : (
              <p className="orders-empty">Pesanan tidak ditemukan</p>
            )}
          </div>

          {/* Error load awal dari context (bukan dari aksi hapus) */}
          {displayError && <p role="alert">{displayError}</p>}
        </section>
      </main>

      {/* Modal konfirmasi hapus — pop-up */}
      {pendingDelete && (
        <DeleteConfirmModal
          pending={pending}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}

      {/* Toast notifikasi — pop-up */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <Footer />
    </>
  );
}