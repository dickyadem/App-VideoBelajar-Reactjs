import { render, waitForOrders } from '../test/renderWithCatalog';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

beforeEach(() => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true }));
  vi.stubGlobal('scrollTo', vi.fn());
});
afterEach(() => { cleanup(); localStorage.clear(); vi.unstubAllGlobals(); });

async function open(path = '/course/design-thinking-praktis/pay?method=bca') {
  render(<MemoryRouter initialEntries={[path]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
  await waitForOrders();
}

test('renders the payment page with the selected method and countdown', async () => {
  await open('/course/design-thinking-praktis/pay?method=dana');
  expect(await screen.findByRole('heading', { name: 'Pembayaran' })).toBeInTheDocument();
  expect(screen.getByText('Dana', { selector: 'strong' })).toBeInTheDocument();
  expect(screen.getByText(/Selesaikan pemesanan dalam/)).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: 'Tata Cara Pembayaran' })).toBeInTheDocument();
});

test('opens payment instructions and completes the demo payment', async () => {
  await open();
  expect(screen.getByText(/Masukkan kartu ATM dan PIN BCA/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Bayar Sekarang' }));
  expect(await screen.findByRole('heading', { name: 'Pembayaran Berhasil!' })).toBeInTheDocument();
});

test('returns to the payment method page when changing method', async () => {
  await open();
  fireEvent.click(screen.getByRole('button', { name: 'Ganti Metode Pembayaran' }));
  expect(await screen.findByRole('heading', { name: 'Ubah Metode Pembayaran' })).toBeInTheDocument();
});

test.each([
  ['success', 'Pembayaran Berhasil!'],
  ['pending', 'Pembayaran Tertunda!'],
])('renders the %s payment result page', async (status, title) => {
  await open(`/course/design-thinking-praktis/pay?method=bca&status=${status}`);
  expect(await screen.findByRole('heading', { name: title })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Lihat Detail Pesanan' })).toHaveAttribute('href', '/orders');
  expect(screen.getByText(/Silakan cek email kamu/)).toBeInTheDocument();
});
