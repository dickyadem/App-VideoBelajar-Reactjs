import { render } from '../test/renderWithCatalog';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

beforeEach(() => localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky Adem', isLoggedIn: true })));
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

test('previews and saves a profile photo that persists after reopening', async () => {
  open();
  fireEvent.change(screen.getByLabelText('Pilih foto profil'), { target: { files: [new File(['photo'], 'avatar.png', { type: 'image/png' })] } });
  expect(await screen.findByAltText('Pratinjau foto profil')).toHaveAttribute('src', expect.stringContaining('data:image/png;base64,'));
  expect(JSON.parse(localStorage.getItem('videobelajar-user')).photo).toBeUndefined();
  fireEvent.click(screen.getByRole('button', { name: 'Simpan' }));
  expect(screen.getByAltText('Foto profil Dicky Adem')).toBeInTheDocument();
  cleanup();
  open();
  expect(screen.getByAltText('Pratinjau foto profil')).toHaveAttribute('src', JSON.parse(localStorage.getItem('videobelajar-user')).photo);
});

test('rejects unsupported or oversized photos', () => {
  open();
  const input = screen.getByLabelText('Pilih foto profil');
  fireEvent.change(input, { target: { files: [new File(['text'], 'file.txt', { type: 'text/plain' })] } });
  expect(screen.getByRole('alert')).toHaveTextContent('JPG, PNG, atau WebP');
  fireEvent.change(input, { target: { files: [new File([new Uint8Array(1024 * 1024 + 1)], 'large.png', { type: 'image/png' })] } });
  expect(screen.getByRole('alert')).toHaveTextContent('maksimal 1 MB');
});
