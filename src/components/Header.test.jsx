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
  expect(screen.getByLabelText('Profil Dicky Adem')).toHaveTextContent('DA');
  expect(screen.getByRole('button', { name: 'Keluar' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();
});

test('logout restores guest actions', () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true }));
  renderHeader();
  fireEvent.click(screen.getByRole('button', { name: 'Keluar' }));
  expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  expect(localStorage.getItem('videobelajar-user')).toBeNull();
});