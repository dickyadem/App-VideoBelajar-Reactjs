import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

beforeEach(() => localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky Adem', isLoggedIn: true }));
afterEach(() => { cleanup(); localStorage.clear(); });

function open(path = '/profile') {
  render(<MemoryRouter initialEntries={[path]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
}

test('renders the profile form', () => {
  open();
  expect(screen.getByRole('heading', { name: 'Ubah Profil' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Profil Saya' })).toHaveAttribute('href', '/profile');
  expect(screen.getByLabelText('Nama Lengkap')).toHaveValue('Dicky Adem');
  expect(screen.getByLabelText('E-Mail')).toHaveValue('dicky.adem@example.com');
  expect(screen.getByRole('button', { name: 'Simpan' })).toBeInTheDocument();
});

test('saves updated profile data', () => {
  open();
  fireEvent.change(screen.getByLabelText('Nama Lengkap'), { target: { value: 'Jannie Ruby Jane' } });
  fireEvent.change(screen.getByLabelText('E-Mail'), { target: { value: 'rubyjane@gmail.com' } });
  fireEvent.click(screen.getByRole('button', { name: 'Simpan' }));
  expect(screen.getByRole('status')).toHaveTextContent('Profil berhasil disimpan');
  expect(JSON.parse(localStorage.getItem('videobelajar-user'))).toMatchObject({ name: 'Jannie Ruby Jane', email: 'rubyjane@gmail.com' });
});

test('redirects a guest to login', () => {
  localStorage.clear();
  open();
  expect(screen.getByRole('heading', { name: 'Masuk ke Akun' })).toBeInTheDocument();
});