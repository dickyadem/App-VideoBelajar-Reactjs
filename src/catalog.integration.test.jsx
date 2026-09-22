import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { getOrders, readMockOrders } from './test/orderServiceMock';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import coursesReducer from './store/redux/coursesReducer';
import catalogReducer from './store/redux/catalogReducer';

vi.mock('./services/api/catalogService', () => ({ getCatalog: vi.fn() }));
vi.mock('./services/api/courseApi', () => ({ getCourses: vi.fn(), createCourse: vi.fn(), updateCourse: vi.fn(), deleteCourse: vi.fn() }));
vi.mock('./firebase', () => ({ db: {}, auth: {} }));
vi.mock('./services/api/authService', () => ({
  subscribeToAuth: (callback) => {
    const user = JSON.parse(localStorage.getItem('videobelajar-user') || 'null');
    callback(user?.isLoggedIn ? { uid: user.uid || 'catalog-user', displayName: user.name, email: 'catalog@example.com' } : null);
    return () => {};
  },
  createAccount: vi.fn(), loginAccount: vi.fn(), logoutAccount: vi.fn(), updateAccountProfile: vi.fn(),
}));
vi.mock('./services/api/profileService', () => ({ getProfile: vi.fn(async () => ({})), saveProfile: vi.fn().mockResolvedValue() }));
vi.mock('firebase/firestore', () => ({ doc: vi.fn(), serverTimestamp: vi.fn(), setDoc: vi.fn().mockResolvedValue() }));
import { getCatalog } from './services/api/catalogService';
import { createCourse, updateCourse, deleteCourse } from './services/api/courseApi';

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
  const user = JSON.parse(localStorage.getItem('videobelajar-user') || 'null');
  if (user?.isLoggedIn) await getOrders(user.uid || 'catalog-user');
  const reduxStore = configureStore({ reducer: { courses: coursesReducer, catalog: catalogReducer } });
  return { ...render(<Provider store={reduxStore}><MemoryRouter initialEntries={[path]}><AuthProvider><CatalogProvider><App /></CatalogProvider></AuthProvider></MemoryRouter></Provider>), reduxStore };
}

test('stores the displayed catalog in the Redux course array', async () => {
  const { reduxStore } = await open();
  await screen.findByRole('link', { name: course.title });
  expect(reduxStore.getState().courses).toEqual([course]);
});

test('course management dispatches CRUD and keeps the public catalog in sync', async () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Pengelola', isLoggedIn: true }));
  createCourse.mockImplementation(async (data) => ({ ...data, id: 'new-course' }));
  updateCourse.mockImplementation(async (id, changes) => ({ id, ...changes }));
  deleteCourse.mockResolvedValue(undefined);
  vi.stubGlobal('confirm', vi.fn(() => true));
  const { reduxStore } = await open('/manage-courses');
  await screen.findByRole('heading', { name: 'Kelola Kelas' });
  fireEvent.change(screen.getByLabelText('Judul kelas'), { target: { value: 'Kelas Redux' } });
  fireEvent.change(screen.getByLabelText('Harga (Rp)'), { target: { value: '99000' } });
  fireEvent.change(screen.getByLabelText('Kategori'), { target: { value: 'science' } });
  fireEvent.click(screen.getByRole('button', { name: 'Tambah kelas' }));
  await screen.findByRole('button', { name: 'Edit Kelas Redux' });
  expect(createCourse).toHaveBeenCalledWith(expect.objectContaining({ title: 'Kelas Redux', priceAmount: 99000, status: 'published' }));
  expect(reduxStore.getState().courses.find((item) => item.id === 'new-course')).toMatchObject({ slug: 'new-course', price: 'Rp 99.000' });
  fireEvent.click(screen.getByRole('button', { name: 'Edit Kelas Redux' }));
  fireEvent.change(screen.getByLabelText('Judul kelas'), { target: { value: 'Redux Lanjutan' } });
  fireEvent.change(screen.getByLabelText('Harga (Rp)'), { target: { value: '125000' } });
  fireEvent.click(screen.getByRole('button', { name: 'Simpan perubahan' }));
  await screen.findByRole('button', { name: 'Edit Redux Lanjutan' });
  expect(reduxStore.getState().courses.find((item) => item.id === 'new-course')).toMatchObject({ slug: 'new-course', title: 'Redux Lanjutan', price: 'Rp 125.000' });
  fireEvent.click(screen.getByRole('button', { name: 'Hapus Redux Lanjutan' }));
  await screen.findByText('Kelas berhasil dihapus.');
  expect(reduxStore.getState().courses.map((item) => item.id)).toEqual(['remote']);
  expect(deleteCourse).toHaveBeenCalledWith('new-course');
  fireEvent.click(screen.getByRole('link', { name: 'Lihat katalog' }));
  expect(await screen.findByRole('link', { name: course.title })).toBeInTheDocument();
  expect(screen.queryByText('Redux Lanjutan')).not.toBeInTheDocument();
});

test('failed course writes preserve the list and form, and pending writes block duplicates', async () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Pengelola', isLoggedIn: true }));
  updateCourse.mockRejectedValueOnce(new Error('permission-denied'));
  const { reduxStore } = await open('/manage-courses');
  fireEvent.click(await screen.findByRole('button', { name: `Edit ${course.title}` }));
  fireEvent.change(screen.getByLabelText('Judul kelas'), { target: { value: 'Judul Baru' } });
  fireEvent.click(screen.getByRole('button', { name: 'Simpan perubahan' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Gagal menyimpan kelas');
  expect(screen.getByLabelText('Judul kelas')).toHaveValue('Judul Baru');
  expect(reduxStore.getState().courses[0].title).toBe(course.title);
  let resolve;
  updateCourse.mockReturnValueOnce(new Promise((done) => { resolve = done; }));
  fireEvent.click(screen.getByRole('button', { name: 'Simpan perubahan' }));
  expect(screen.getByRole('button', { name: 'Menyimpan...' })).toBeDisabled();
  expect(reduxStore.getState().courses[0].title).toBe(course.title);
  await act(async () => resolve({ id: course.id, title: 'Judul Baru' }));
  expect(reduxStore.getState().courses[0].title).toBe('Judul Baru');
  expect(reduxStore.getState().catalog.courseDetails.remote.modules).toEqual(catalog.courseDetails.remote.modules);
  expect(reduxStore.getState().catalog.courseDetails.remote.reviews).toEqual(catalog.courseDetails.remote.reviews);
  fireEvent.click(screen.getByRole('link', { name: 'Lihat katalog' }));
  expect(await screen.findByRole('link', { name: 'Judul Baru' })).toBeInTheDocument();
});

test('cancelled and rejected course deletions leave the course visible', async () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Pengelola', isLoggedIn: true }));
  vi.stubGlobal('confirm', vi.fn(() => false));
  deleteCourse.mockRejectedValueOnce(new Error('permission-denied'));
  const { reduxStore } = await open('/manage-courses');
  fireEvent.click(await screen.findByRole('button', { name: `Hapus ${course.title}` }));
  expect(deleteCourse).not.toHaveBeenCalled();
  window.confirm.mockReturnValue(true);
  fireEvent.click(screen.getByRole('button', { name: `Hapus ${course.title}` }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Gagal menghapus kelas');
  expect(reduxStore.getState().courses).toEqual([course]);
  expect(screen.getByRole('button', { name: `Hapus ${course.title}` })).toBeEnabled();
});

test('course management requires a signed-in session', async () => {
  await open('/manage-courses');
  expect(await screen.findByRole('heading', { name: 'Masuk ke Akun' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Tambah kelas' })).not.toBeInTheDocument();
});

test('rejected creation keeps input and retry waits for server acknowledgement', async () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Pengelola', isLoggedIn: true }));
  createCourse.mockRejectedValueOnce(new Error('permission-denied'));
  const { reduxStore } = await open('/manage-courses');
  await screen.findByRole('heading', { name: 'Kelola Kelas' });
  fireEvent.change(screen.getByLabelText('Judul kelas'), { target: { value: 'Kelas Percobaan' } });
  fireEvent.change(screen.getByLabelText('Harga (Rp)'), { target: { value: '99000' } });
  fireEvent.change(screen.getByLabelText('Kategori'), { target: { value: 'science' } });
  fireEvent.click(screen.getByRole('button', { name: 'Tambah kelas' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Gagal menyimpan kelas');
  expect(screen.getByLabelText('Judul kelas')).toHaveValue('Kelas Percobaan');
  expect(reduxStore.getState().courses).toEqual([course]);
  let resolve;
  createCourse.mockReturnValueOnce(new Promise((done) => { resolve = done; }));
  fireEvent.click(screen.getByRole('button', { name: 'Tambah kelas' }));
  const pending = screen.getByRole('button', { name: 'Menyimpan...' });
  fireEvent.click(pending);
  expect(pending).toBeDisabled();
  expect(createCourse).toHaveBeenCalledTimes(2);
  expect(reduxStore.getState().courses).toEqual([course]);
  await act(async () => resolve({ id: 'created', title: 'Kelas Percobaan', priceAmount: 99000 }));
  expect(reduxStore.getState().courses).toHaveLength(2);
  expect(screen.getByLabelText('Judul kelas')).toHaveValue('');
});

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
  await waitFor(() => expect(readMockOrders()[0]).toMatchObject({ method: 'remote-bank' }));
  const orders = readMockOrders();
  expect(orders).toHaveLength(1);
  expect(orders[0]).toMatchObject({ id: 'existing-order', method: 'remote-bank' });
});

test('shows a completed order even when its payment method is no longer active', async () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Peserta', isLoggedIn: true, orders: [{ id: 'paid-order', slug: 'remote', method: 'disabled', status: 'Berhasil' }] }));
  await open('/course/remote/pay?order=paid-order&method=disabled');
  expect(await screen.findByRole('heading', { name: 'Pembayaran Berhasil!' })).toBeInTheDocument();
});
