import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

beforeEach(() => localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true })));
afterEach(() => { cleanup(); localStorage.clear(); });

function open(path = '/classes') {
  render(<MemoryRouter initialEntries={[path]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
}

test('renders the classes page with progress cards', () => {
  open();
  expect(screen.getByRole('heading', { name: 'Daftar Kelas' })).toBeInTheDocument();
  expect(screen.getByLabelText('Kelas Saya')).toHaveAttribute('href', '/classes');
  expect(screen.getByRole('tab', { name: 'Semua Kelas' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getAllByRole('article')).toHaveLength(3);
  expect(screen.getByText('100%')).toBeInTheDocument();
});

test('filters running and completed classes', () => {
  open();
  fireEvent.click(screen.getByRole('tab', { name: 'Sedang Berjalan' }));
  expect(screen.getAllByRole('article', { name: /Kelas/ })).toHaveLength(2);
  fireEvent.click(screen.getByRole('tab', { name: 'Selesai' }));
  expect(screen.getAllByRole('article', { name: /Kelas/ })).toHaveLength(1);
  expect(screen.getByRole('button', { name: 'Unduh Sertifikat' })).toBeInTheDocument();
});

test('class actions open the video learning page', () => {
  open();
  expect(screen.getByRole('link', { name: 'Lihat Detail Kelas' })).toHaveAttribute('href', '/learn/big-4-auditor-financial-analyst');
  fireEvent.click(screen.getByRole('tab', { name: 'Sedang Berjalan' }));
  expect(screen.getAllByRole('link', { name: 'Lanjutkan Pembelajaran' })[0]).toHaveAttribute('href', '/learn/strategi-marketing-berbasis-data');
});

test('searches classes by title', () => {
  open();
  fireEvent.change(screen.getByRole('searchbox', { name: 'Cari Kelas' }), { target: { value: 'tidak ada' } });
  expect(screen.getByText('Kelas tidak ditemukan')).toBeInTheDocument();
});

test('redirects a guest to login', () => {
  localStorage.clear();
  open();
  expect(screen.getByRole('heading', { name: 'Masuk ke Akun' })).toBeInTheDocument();
});