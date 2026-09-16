import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

beforeEach(() => localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true, orders: Array.from({ length: 5 }, (_, index) => ({ id: String(index), slug: 'design-thinking-praktis', title: 'Design Thinking Praktis', category: 'design', image: '', price: 275000, total: 282000, method: 'bca', date: '2026-09-16T00:00:00Z', status: index === 0 ? 'Gagal' : 'Belum Bayar' })) })));
afterEach(() => { cleanup(); localStorage.clear(); });

function open(path = '/orders') {
  render(<MemoryRouter initialEntries={[path]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
}

test('renders the mobile-friendly orders page', () => {
  open();
  expect(screen.getByRole('heading', { name: 'Daftar Pesanan' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Pesanan Saya' })).toHaveAttribute('href', '/orders');
  expect(screen.getByRole('tab', { name: 'Semua Kelas' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getAllByRole('article', { name: /Pesanan/ })).toHaveLength(5);
});

test('filters orders by status', () => {
  open();
  fireEvent.click(screen.getByRole('tab', { name: 'Gagal' }));
  expect(screen.getAllByRole('article', { name: /Pesanan/ })).toHaveLength(1);
  expect(screen.getAllByText('Gagal')).toHaveLength(2);
});

test('filters orders by class search', () => {
  open();
  fireEvent.change(screen.getByRole('searchbox', { name: 'Cari Kelas' }), { target: { value: 'Design' } });
  expect(screen.getAllByRole('article', { name: /Pesanan/ })).toHaveLength(5);
  fireEvent.change(screen.getByRole('searchbox', { name: 'Cari Kelas' }), { target: { value: 'Tidak ada' } });
  expect(screen.getByText('Pesanan tidak ditemukan')).toBeInTheDocument();
});

test('redirects a guest to login', () => {
  localStorage.clear();
  open();
  expect(screen.getByRole('heading', { name: 'Masuk ke Akun' })).toBeInTheDocument();
});

test('creates, changes method, pays and reads a persisted order', () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Buyer', isLoggedIn: true }));
  open('/course/design-thinking-praktis/payment');
  fireEvent.click(screen.getByRole('radio', { name: 'Bank BCA' }));
  fireEvent.click(screen.getByRole('button', { name: 'Beli Sekarang' }));
  const read = () => JSON.parse(localStorage.getItem('videobelajar-user')).orders;
  expect(read()).toHaveLength(1);
  expect(read()[0].status).toBe('Belum Bayar');
  fireEvent.click(screen.getByRole('button', { name: 'Ganti Metode Pembayaran' }));
  fireEvent.click(screen.getByRole('radio', { name: 'Bank BNI' }));
  fireEvent.click(screen.getByRole('button', { name: 'Bayar Sekarang' }));
  expect(read()).toHaveLength(1);
  expect(read()[0].method).toBe('bni');
  fireEvent.click(screen.getByRole('button', { name: 'Bayar Sekarang' }));
  expect(read()[0].status).toBe('Berhasil');
  fireEvent.click(screen.getByRole('link', { name: 'Lihat Detail Pesanan' }));
  expect(screen.getByRole('article', { name: 'Pesanan Berhasil' })).toHaveTextContent('Design Thinking Praktis');
  expect(screen.queryByRole('button', { name: 'Hapus Pesanan' })).not.toBeInTheDocument();
  cleanup();
  open('/orders');
  expect(screen.getByRole('article', { name: 'Pesanan Berhasil' })).toBeInTheDocument();
});

test('deletes only after confirmation and persists removal', () => {
  open();
  fireEvent.click(screen.getAllByRole('button', { name: 'Hapus Pesanan' })[0]);
  fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
  expect(screen.getAllByRole('article')).toHaveLength(5);
  fireEvent.click(screen.getAllByRole('button', { name: 'Hapus Pesanan' })[0]);
  fireEvent.click(screen.getByRole('button', { name: 'Ya, Hapus' }));
  expect(screen.getAllByRole('article')).toHaveLength(4);
  expect(JSON.parse(localStorage.getItem('videobelajar-user')).orders).toHaveLength(4);
});
