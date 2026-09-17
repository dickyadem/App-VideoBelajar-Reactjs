import App from '../App';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, test } from 'vitest';
import RegisterPage from './RegisterPage';
import { AuthProvider } from '../context/AuthContext';

test('shows an error for nonmatching passwords', () => {
  render(<MemoryRouter><AuthProvider><RegisterPage /></AuthProvider></MemoryRouter>);
  fireEvent.change(screen.getByLabelText(/Nama/), { target: { value: 'Dicky Adem' } });
  fireEvent.change(screen.getByLabelText(/E-mail/), { target: { value: 'dicky@example.com' } });
  fireEvent.change(screen.getByLabelText(/^Nomor HP/), { target: { value: '8123456789' } });
  fireEvent.change(screen.getByLabelText(/^Kata Sandi/), { target: { value: 'rahasia' } });
  fireEvent.change(screen.getByLabelText(/Konfirmasi Kata Sandi/), { target: { value: 'berbeda' } });
  fireEvent.click(screen.getByRole('button', { name: 'Daftar' }));
  expect(screen.getByText('Konfirmasi kata sandi harus sama.')).toBeInTheDocument();
});


afterEach(() => { cleanup(); localStorage.clear(); });

test('returns to login with a success message without signing in', () => {
  render(<MemoryRouter initialEntries={['/register']}><AuthProvider><App /></AuthProvider></MemoryRouter>);
  fireEvent.change(screen.getByLabelText(/Nama/), { target: { value: 'Dicky Adem' } });
  fireEvent.change(screen.getByLabelText(/E-mail/), { target: { value: 'dicky@example.com' } });
  fireEvent.change(screen.getByLabelText(/^Nomor HP/), { target: { value: '8123456789' } });
  fireEvent.change(screen.getByLabelText(/^Kata Sandi/), { target: { value: 'rahasia' } });
  fireEvent.change(screen.getByLabelText(/Konfirmasi Kata Sandi/), { target: { value: 'rahasia' } });
  fireEvent.click(screen.getByRole('button', { name: 'Daftar' }));
  expect(screen.getByRole('heading', { name: 'Masuk ke Akun' })).toBeInTheDocument();
  expect(screen.getByText('Pendaftaran berhasil! Silakan masuk menggunakan akunmu.')).toBeInTheDocument();
  expect(localStorage.getItem('videobelajar-user')).toBeNull();
});
