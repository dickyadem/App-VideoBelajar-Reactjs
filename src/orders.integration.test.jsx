import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { render } from './test/renderWithCatalog';
import App from './App';
import { AuthProvider } from './context/AuthContext';

vi.mock('./services/orderService', () => ({ getOrders: vi.fn(), createOrder: vi.fn(), updateOrder: vi.fn(), deleteOrder: vi.fn() }));
import * as ordersApi from './services/orderService';

const order = { id: 'remote-order', userId: 'user-1', slug: 'design-thinking-praktis', title: 'Design Thinking Praktis', category: 'design', image: '/course.webp', price: 275000, total: 282000, method: 'bca', status: 'Belum Bayar', date: '2026-09-18T00:00:00.000Z' };
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('videobelajar-user', JSON.stringify({ uid: 'user-1', name: 'Peserta', isLoggedIn: true }));
  Object.values(ordersApi).forEach((fn) => fn.mockReset());
  ordersApi.getOrders.mockResolvedValue([]);
  ordersApi.createOrder.mockResolvedValue(order);
  ordersApi.updateOrder.mockImplementation(async (_uid, _id, changes) => ({ ...order, ...changes }));
  ordersApi.deleteOrder.mockResolvedValue(undefined);
  vi.stubGlobal('scrollTo', vi.fn());
});
afterEach(() => { cleanup(); localStorage.clear(); vi.unstubAllGlobals(); });
function open(path = '/orders') {
  return render(<MemoryRouter initialEntries={[path]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
}

test('GET shows loading and retries a failed read rather than using local orders', async () => {
  ordersApi.getOrders.mockRejectedValueOnce(new Error('unavailable')).mockResolvedValueOnce([order]);
  open();
  expect(screen.getByText('Memuat pesanan...')).toBeInTheDocument();
  expect(await screen.findByRole('alert')).toHaveTextContent('Gagal memuat pesanan');
  fireEvent.click(screen.getByRole('button', { name: 'Coba lagi' }));
  expect(await screen.findByRole('article', { name: 'Pesanan Belum Bayar' })).toBeInTheDocument();
  expect(ordersApi.getOrders).toHaveBeenCalledWith('user-1');
});

test('ADD waits for Firebase acknowledgement and blocks duplicate clicks', async () => {
  let resolve;
  ordersApi.createOrder.mockReturnValue(new Promise((done) => { resolve = done; }));
  open('/course/design-thinking-praktis/payment');
  fireEvent.click(await screen.findByRole('radio', { name: 'Bank BCA' }));
  const buy = screen.getByRole('button', { name: 'Beli Sekarang' });
  fireEvent.click(buy);
  fireEvent.click(buy);
  expect(buy).toBeDisabled();
  expect(screen.queryByRole('heading', { name: 'Pembayaran' })).not.toBeInTheDocument();
  expect(ordersApi.createOrder).toHaveBeenCalledTimes(1);
  await act(async () => resolve(order));
  expect(await screen.findByRole('heading', { name: 'Pembayaran' })).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('videobelajar-user')).orders).toBeUndefined();
});

test('a failed ADD keeps the form available for retry without reporting success', async () => {
  ordersApi.createOrder.mockRejectedValueOnce(new Error('permission-denied'));
  open('/course/design-thinking-praktis/payment');
  fireEvent.click(await screen.findByRole('radio', { name: 'Bank BCA' }));
  fireEvent.click(screen.getByRole('button', { name: 'Beli Sekarang' }));
  expect(await screen.findByText(/Pesanan belum tersimpan/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Beli Sekarang' })).toBeEnabled();
  fireEvent.click(screen.getByRole('button', { name: 'Beli Sekarang' }));
  expect(await screen.findByRole('heading', { name: 'Pembayaran' })).toBeInTheDocument();
});

test('UPDATE awaits the server before changing a payment method or marking payment successful', async () => {
  ordersApi.getOrders.mockResolvedValue([order]);
  open('/course/design-thinking-praktis/payment?change=1&order=remote-order');
  fireEvent.click(await screen.findByRole('radio', { name: 'Bank BNI' }));
  fireEvent.click(screen.getByRole('button', { name: 'Bayar Sekarang' }));
  expect(await screen.findByRole('heading', { name: 'Pembayaran' })).toBeInTheDocument();
  expect(ordersApi.updateOrder).toHaveBeenCalledWith('user-1', 'remote-order', { method: 'bni' });
  ordersApi.updateOrder.mockRejectedValueOnce(new Error('unavailable'));
  fireEvent.click(screen.getByRole('button', { name: 'Bayar Sekarang' }));
  expect(await screen.findByText(/Pembayaran belum diproses/)).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Pembayaran Berhasil!' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Bayar Sekarang' }));
  expect(await screen.findByRole('heading', { name: 'Pembayaran Berhasil!' })).toBeInTheDocument();
});

test('DELETE needs confirmation and preserves the row when Firebase rejects the delete', async () => {
  ordersApi.getOrders.mockResolvedValue([order]);
  ordersApi.deleteOrder.mockRejectedValueOnce(new Error('unavailable'));
  open();
  fireEvent.click(await screen.findByRole('button', { name: 'Hapus Pesanan' }));
  fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
  expect(ordersApi.deleteOrder).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Hapus Pesanan' }));
  fireEvent.click(screen.getByRole('button', { name: 'Ya, Hapus' }));
  expect(await screen.findByText(/Pesanan belum berhasil dihapus/)).toBeInTheDocument();
  expect(screen.getByRole('article', { name: 'Pesanan Belum Bayar' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Ya, Hapus' }));
  expect(await screen.findByText('Pesanan berhasil dihapus.')).toBeInTheDocument();
  expect(screen.queryByRole('article')).not.toBeInTheDocument();
});

test('GET restores orders from Firebase after remount without local order data', async () => {
  ordersApi.getOrders.mockResolvedValue([order]);
  open();
  expect(await screen.findByRole('article', { name: 'Pesanan Belum Bayar' })).toBeInTheDocument();
  cleanup();
  open();
  expect(await screen.findByRole('article', { name: 'Pesanan Belum Bayar' })).toBeInTheDocument();
  expect(ordersApi.getOrders).toHaveBeenCalledTimes(2);
});

test('reuses a pending remote order for the same course rather than adding another', async () => {
  ordersApi.getOrders.mockResolvedValue([order]);
  open('/course/design-thinking-praktis/payment');
  fireEvent.click(await screen.findByRole('radio', { name: 'Bank BNI' }));
  fireEvent.click(screen.getByRole('button', { name: 'Beli Sekarang' }));
  expect(await screen.findByRole('heading', { name: 'Pembayaran' })).toBeInTheDocument();
  expect(ordersApi.createOrder).not.toHaveBeenCalled();
  expect(ordersApi.updateOrder).toHaveBeenCalledWith('user-1', 'remote-order', { method: 'bni' });
});

test('does not navigate back into checkout when an old session write resolves after logout', async () => {
  let resolve;
  ordersApi.createOrder.mockReturnValue(new Promise((done) => { resolve = done; }));
  open('/course/design-thinking-praktis/payment');
  fireEvent.click(await screen.findByRole('radio', { name: 'Bank BCA' }));
  fireEvent.click(screen.getByRole('button', { name: 'Beli Sekarang' }));
  fireEvent.click(screen.getByRole('button', { name: 'Buka menu profil Peserta' }));
  fireEvent.click(screen.getByRole('button', { name: 'Keluar' }));
  await act(async () => resolve(order));
  expect(screen.getByRole('heading', { name: 'Masuk ke Akun' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Pembayaran' })).not.toBeInTheDocument();
});

test.each(['payment', 'pay?method=bca'])('does not redirect after leaving %s while an order is saving', async (page) => {
  let resolve;
  ordersApi.createOrder.mockReturnValue(new Promise((done) => { resolve = done; }));
  open(`/course/design-thinking-praktis/${page}`);
  if (page === 'payment') fireEvent.click(await screen.findByRole('radio', { name: 'Bank BCA' }));
  fireEvent.click(await screen.findByRole('button', { name: page === 'payment' ? 'Beli Sekarang' : 'Bayar Sekarang' }));
  fireEvent.click(screen.getByRole('button', { name: 'Buka menu profil Peserta' }));
  fireEvent.click(screen.getByRole('link', { name: 'Pesanan Saya' }));
  expect(screen.getByRole('heading', { name: 'Daftar Pesanan' })).toBeInTheDocument();
  await act(async () => resolve(page === 'payment' ? order : { ...order, status: 'Berhasil' }));
  expect(screen.getByRole('heading', { name: 'Daftar Pesanan' })).toBeInTheDocument();
});
