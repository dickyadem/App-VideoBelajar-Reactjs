import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { readMockOrders } from './test/orderServiceMock';

vi.mock('./services/catalogService', () => ({ getCatalog: vi.fn() }));
vi.mock('./firebase', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({ doc: vi.fn(), serverTimestamp: vi.fn(), setDoc: vi.fn().mockResolvedValue() }));
import { getCatalog } from './services/catalogService';

const course = { id: 'remote', slug: 'remote', title: 'Kelas Baru Firestore', category: 'science', description: 'Deskripsi dari database', instructorName: 'Tutor Baru', instructorRole: 'Pengajar', image: '/remote.webp', instructorImage: '/tutor.webp', priceAmount: 125000, price: 'Rp 125.000', rating: '4.8 (12)' };
const catalog = {
  courses: [course],
  categories: [['science', 'Sains']],
  courseDetails: { remote: { description: course.description, tutorBio: 'Profil tutor remote', modules: [{ id: 'm1', title: 'Modul Remote', lessons: [{ id: 'l1', title: 'Pelajaran Remote', minutes: 10 }] }], reviews: [{ id: 'r1', name: 'Peserta Baru', batch: 'Batch 1', text: 'Ulasan dari database' }] } },
  paymentGroups: [{ id: 'bank', title: 'Transfer Bank', options: [{ id: 'remote-bank', name: 'Bank Remote' }] }],
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  vi.stubGlobal('scrollTo', vi.fn());
  getCatalog.mockResolvedValue(structuredClone(catalog));
});
afterEach(() => { cleanup(); localStorage.clear(); vi.unstubAllGlobals(); });

async function open(path = '/') {
  const { CatalogProvider } = await import('./context/CatalogContext');
  return render(<MemoryRouter initialEntries={[path]}><AuthProvider><CatalogProvider><App /></CatalogProvider></AuthProvider></MemoryRouter>);
}

test('shows loading then renders remote courses and categories without static fallback', async () => {
  let resolve;
  getCatalog.mockReturnValue(new Promise((done) => { resolve = done; }));
  await open();
  expect(screen.getByRole('status')).toHaveTextContent('Memuat data kelas');
  expect(screen.queryByText('Big 4 Auditor Financial Analyst')).not.toBeInTheDocument();
  await act(async () => resolve(catalog));
  expect(screen.getByRole('link', { name: course.title })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Sains' })).toBeInTheDocument();
});

test('renders the remote curriculum and reviews after navigation without reloading the catalog', async () => {
  await open();
  fireEvent.click(await screen.findByRole('link', { name: course.title }));
  expect(await screen.findByRole('heading', { name: course.title, level: 1 })).toBeInTheDocument();
  expect(screen.getByText('Modul Remote')).toBeInTheDocument();
  expect(screen.getByText('Pelajaran Remote')).toBeInTheDocument();
  expect(screen.getByText('Ulasan dari database')).toBeInTheDocument();
  expect(getCatalog).toHaveBeenCalledTimes(1);
});

test('shows an actionable read error and retries successfully', async () => {
  getCatalog.mockRejectedValueOnce(new Error('permission-denied'));
  await open();
  expect(await screen.findByRole('alert')).toHaveTextContent('Gagal memuat data kelas');
  expect(screen.queryByText('Big 4 Auditor Financial Analyst')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Coba lagi' }));
  expect(await screen.findByRole('link', { name: course.title })).toBeInTheDocument();
  expect(getCatalog).toHaveBeenCalledTimes(2);
});

test('shows an empty catalog and missing-course state without mock fallback', async () => {
  getCatalog.mockResolvedValue({ courses: [], courseDetails: {}, categories: [], paymentGroups: [] });
  const view = await open();
  expect(await screen.findByText('Belum ada kelas tersedia.')).toBeInTheDocument();
  view.unmount();
  await open('/course/remote');
  expect(await screen.findByRole('heading', { name: 'Kelas tidak ditemukan' })).toBeInTheDocument();
});

test('offers only the methods read from Firestore', async () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Peserta', isLoggedIn: true }));
  await open('/course/remote/payment');
  const method = await screen.findByRole('radio', { name: 'Bank Remote' });
  expect(screen.queryByRole('radio', { name: 'Bank BCA' })).not.toBeInTheDocument();
  fireEvent.click(method);
  fireEvent.click(screen.getByRole('button', { name: 'Beli Sekarang' }));
  expect(await screen.findByRole('heading', { name: 'Pembayaran' })).toBeInTheDocument();
  expect(screen.getByText('Bank Remote', { selector: 'strong' })).toBeInTheDocument();
});

test.each(['/course/remote/payment', '/course/remote/pay'])('handles no active payment methods at %s', async (path) => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Peserta', isLoggedIn: true }));
  getCatalog.mockResolvedValue({ ...catalog, paymentGroups: [] });
  await open(path);
  expect(await screen.findByText('Metode pembayaran belum tersedia.')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Bayar Sekarang' })).not.toBeInTheDocument();
  const buyButton = screen.queryByRole('button', { name: 'Beli Sekarang' });
  if (buyButton) expect(buyButton).toBeDisabled();
});

test('does not replace an invalid payment method with a different provider', async () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Peserta', isLoggedIn: true }));
  await open('/course/remote/pay?method=disabled');
  expect(await screen.findByText('Metode pembayaran tidak tersedia. Silakan pilih metode lain.')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Bayar Sekarang' })).not.toBeInTheDocument();
});

test('keeps login accessible while the catalog request is pending', async () => {
  getCatalog.mockReturnValue(new Promise(() => {}));
  await open('/login');
  expect(screen.getByRole('heading', { name: 'Masuk ke Akun' })).toBeInTheDocument();
});

test('redirects a protected route to login without waiting for the catalog', async () => {
  getCatalog.mockReturnValue(new Promise(() => {}));
  await open('/course/remote/payment');
  expect(await screen.findByRole('heading', { name: 'Masuk ke Akun' })).toBeInTheDocument();
});

test('changes an inactive payment method on the existing order without creating a duplicate', async () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Peserta', isLoggedIn: true, orders: [{ id: 'existing-order', slug: 'remote', method: 'disabled', status: 'Belum Bayar' }] }));
  await open('/course/remote/pay?order=existing-order&method=disabled');
  fireEvent.click(await screen.findByRole('link', { name: 'Pilih metode pembayaran' }));
  fireEvent.click(screen.getByRole('radio', { name: 'Bank Remote' }));
  fireEvent.click(screen.getByRole('button', { name: 'Bayar Sekarang' }));
  await screen.findByRole('heading', { name: 'Pembayaran' });
  const orders = readMockOrders();
  expect(orders).toHaveLength(1);
  expect(orders[0]).toMatchObject({ id: 'existing-order', method: 'remote-bank' });
});

test('shows a completed order even when its payment method is no longer active', async () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Peserta', isLoggedIn: true, orders: [{ id: 'paid-order', slug: 'remote', method: 'disabled', status: 'Berhasil' }] }));
  await open('/course/remote/pay?order=paid-order&method=disabled');
  expect(await screen.findByRole('heading', { name: 'Pembayaran Berhasil!' })).toBeInTheDocument();
});
