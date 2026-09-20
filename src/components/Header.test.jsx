import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test } from 'vitest';
import Header from './Header';
import { AuthProvider } from '../context/AuthContext';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

function renderHeader() {
  return render(<MemoryRouter><AuthProvider><Header /></AuthProvider></MemoryRouter>);
}

test('shows Login and Register to a guest', () => {
  renderHeader();
  expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument();
});

test('shows initials and logout action to a signed-in user', () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky Adem', isLoggedIn: true }));
  renderHeader();
  const profileButton = screen.getByRole('button', { name: 'Buka menu profil Dicky Adem' });
  expect(profileButton).toHaveTextContent('DA');
  fireEvent.click(profileButton);
  expect(screen.getByRole('link', { name: 'Profil Saya' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Kelas Saya' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Pesanan Saya' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Keluar' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();
});

test('falls back to initials when the profile photo cannot load', () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky Adem', photo: 'invalid-image-url', isLoggedIn: true }));
  renderHeader();
  const profileButton = screen.getByRole('button', { name: 'Buka menu profil Dicky Adem' });
  fireEvent.error(screen.getByAltText('Foto profil Dicky Adem'));
  expect(profileButton).toHaveTextContent('DA');
  expect(screen.queryByAltText('Foto profil Dicky Adem')).not.toBeInTheDocument();
});

test('logout restores guest actions', () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true }));
  renderHeader();
  fireEvent.click(screen.getByRole('button', { name: 'Buka menu profil Dicky' }));
  fireEvent.click(screen.getByRole('button', { name: 'Keluar' }));
  expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  expect(localStorage.getItem('videobelajar-user')).toBeNull();
});

test('opens the profile links with the mobile menu', () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true }));
  renderHeader();
  fireEvent.click(screen.getByRole('button', { name: 'Buka menu' }));
  expect(screen.getByRole('link', { name: 'Profil Saya' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Kelas Saya' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Pesanan Saya' })).toBeInTheDocument();
});