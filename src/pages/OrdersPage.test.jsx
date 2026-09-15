import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

beforeEach(() => localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true })));
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
  fireEvent.change(screen.getByRole('searchbox', { name: 'Cari Kelas' }), { target: { value: 'Microsoft' } });
  expect(screen.getAllByRole('article', { name: /Pesanan/ })).toHaveLength(5);
  fireEvent.change(screen.getByRole('searchbox', { name: 'Cari Kelas' }), { target: { value: 'Tidak ada' } });
  expect(screen.getByText('Pesanan tidak ditemukan')).toBeInTheDocument();
});

test('redirects a guest to login', () => {
  localStorage.clear();
  open();
  expect(screen.getByRole('heading', { name: 'Masuk ke Akun' })).toBeInTheDocument();
});