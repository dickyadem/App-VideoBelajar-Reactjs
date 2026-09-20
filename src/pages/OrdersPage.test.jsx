import { render, waitForOrders } from '../test/renderWithCatalog';
import { cleanup, fireEvent, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import { readMockOrders } from '../test/orderServiceMock';

beforeEach(() => localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true, orders: Array.from({ length: 5 }, (_, index) => ({ id: String(index), slug: 'design-thinking-praktis', title: 'Design Thinking Praktis', category: 'design', image: '', price: 275000, total: 282000, method: 'bca', date: '2026-09-16T00:00:00Z', status: index === 0 ? 'Gagal' : 'Belum Bayar' })) })));
afterEach(() => { cleanup(); localStorage.clear(); });

async function open(path = '/orders') {
  render(<MemoryRouter initialEntries={[path]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
  await waitForOrders();
}

test('renders the mobile-friendly orders page', async () => {
  await open();
  expect(await screen.findByRole('heading', { name: 'Daftar Pesanan' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Pesanan Saya' })).toHaveAttribute('href', '/orders');
  expect(screen.getByRole('tab', { name: 'Semua Kelas' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getAllByRole('article', { name: /Pesanan/ })).toHaveLength(5);
});

test('filters orders by status', async () => {
  await open();
  fireEvent.click(screen.getByRole('tab', { name: 'Gagal' }));
  expect(screen.getAllByRole('article', { name: /Pesanan/ })).toHaveLength(1);
  expect(screen.getAllByText('Gagal')).toHaveLength(2);
});

test('filters orders by class search', async () => {
  await open();
  fireEvent.change(screen.getByRole('searchbox', { name: 'Cari Kelas' }), { target: { value: 'Design' } });
  expect(screen.getAllByRole('article', { name: /Pesanan/ })).toHaveLength(5);
  fireEvent.change(screen.getByRole('searchbox', { name: 'Cari Kelas' }), { target: { value: 'Tidak ada' } });
  expect(screen.getByText('Pesanan tidak ditemukan')).toBeInTheDocument();
});

test('redirects a guest to login', async () => {
  localStorage.clear();
  await open();
  expect(await screen.findByRole('heading', { name: 'Masuk ke Akun' })).toBeInTheDocument();
});

test('creates, changes method, pays and reads a persisted order', async () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Buyer', isLoggedIn: true }));
  await open('/course/design-thinking-praktis/payment');
  fireEvent.click(screen.getByRole('radio', { name: 'Bank BCA' }));
  fireEvent.click(screen.getByRole('button', { name: 'Beli Sekarang' }));
  await screen.findByRole('heading', { name: 'Pembayaran' });
  const read = readMockOrders;
  expect(read()).toHaveLength(1);
  expect(read()[0].status).toBe('Belum Bayar');
  fireEvent.click(screen.getByRole('button', { name: 'Ganti Metode Pembayaran' }));
  fireEvent.click(screen.getByRole('radio', { name: 'Bank BNI' }));
  fireEvent.click(screen.getByRole('button', { name: 'Bayar Sekarang' }));
  await screen.findByRole('heading', { name: 'Pembayaran' });
  expect(read()).toHaveLength(1);
  expect(read()[0].method).toBe('bni');
  fireEvent.click(screen.getByRole('button', { name: 'Bayar Sekarang' }));
  await screen.findByRole('heading', { name: 'Pembayaran Berhasil!' });
  expect(read()[0].status).toBe('Berhasil');
  fireEvent.click(screen.getByRole('link', { name: 'Lihat Detail Pesanan' }));
  expect(screen.getByRole('article', { name: 'Pesanan Berhasil' })).toHaveTextContent('Design Thinking Praktis');
  expect(screen.queryByRole('button', { name: 'Hapus Pesanan' })).not.toBeInTheDocument();
  cleanup();
  await open('/orders');
  expect(screen.getByRole('article', { name: 'Pesanan Berhasil' })).toBeInTheDocument();
});

test('deletes only after confirmation and persists removal', async () => {
  await open();
  fireEvent.click(screen.getAllByRole('button', { name: 'Hapus Pesanan' })[0]);
  fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
  expect(screen.getAllByRole('article')).toHaveLength(5);
  fireEvent.click(screen.getAllByRole('button', { name: 'Hapus Pesanan' })[0]);
  fireEvent.click(screen.getByRole('button', { name: 'Ya, Hapus' }));
  await screen.findByText('Pesanan berhasil dihapus.');
  expect(screen.getAllByRole('article')).toHaveLength(4);
  expect(readMockOrders()).toHaveLength(4);
});
