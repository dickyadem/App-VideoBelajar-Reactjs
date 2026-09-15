import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

const detail = '/course/design-thinking-praktis';
const payment = `${detail}/pay?method=bca`;
function open(path) {
  render(<MemoryRouter initialEntries={[path]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
}
function signIn() {
  fireEvent.change(screen.getByLabelText(/E-mail/), { target: { value: 'dicky@example.com' } });
  fireEvent.change(screen.getByLabelText(/Kata Sandi/), { target: { value: 'rahasia' } });
  fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));
}
beforeEach(() => { localStorage.clear(); vi.stubGlobal('scrollTo', vi.fn()); });
afterEach(() => { cleanup(); localStorage.clear(); vi.unstubAllGlobals(); });

test.each(['buy', 'direct'])('requires login via %s and returns to the selected payment page', (entry) => {
  open(entry === 'buy' ? detail : payment);
  if (entry === 'buy') fireEvent.click(screen.getByRole('link', { name: 'Beli Sekarang' }));
  expect(screen.getByRole('heading', { name: 'Masuk ke Akun' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Ubah Metode Pembayaran' })).not.toBeInTheDocument();
  signIn();
  expect(screen.getByRole('heading', { name: entry === 'buy' ? 'Metode Pembayaran' : 'Pembayaran' })).toBeInTheDocument();
  expect(screen.getByText('Rp 282.000')).toBeInTheDocument();
});

test('allows an existing logged-in user and redirects after logout', () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true }));
  open(payment);
  expect(screen.getByRole('heading', { name: 'Pembayaran' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Buka menu profil Dicky' }));
  fireEvent.click(screen.getByRole('button', { name: 'Keluar' }));
  expect(screen.getByRole('heading', { name: 'Masuk ke Akun' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Pembayaran' })).not.toBeInTheDocument();
});

test('rejects a stored user that is not logged in', () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: false }));
  open(payment);
  expect(screen.getByRole('heading', { name: 'Masuk ke Akun' })).toBeInTheDocument();
});

test('ordinary login still goes to home', () => {
  open('/login');
  signIn();
  expect(screen.getByRole('heading', { name: 'Temukan ilmu baru melalui video pembelajaran interaktif.' })).toBeInTheDocument();
});
