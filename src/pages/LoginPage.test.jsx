import { render } from '../test/renderWithCatalog';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test } from 'vitest';
import LoginPage from './LoginPage';
import { AuthProvider } from '../context/AuthContext';
import App from '../App';

beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  localStorage.clear();
});

test('signs in with Firebase after valid credentials', async () => {
  render(<MemoryRouter><AuthProvider><LoginPage /></AuthProvider></MemoryRouter>);
  fireEvent.change(screen.getByLabelText(/E-mail/), { target: { value: 'dicky@example.com' } });
  fireEvent.change(screen.getByLabelText(/Kata Sandi/), { target: { value: 'rahasia' } });
  fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));
  expect(await screen.findByText('Berhasil masuk.')).toBeInTheDocument();
});

test('ignores an external redirect target after login', async () => {
  render(<MemoryRouter initialEntries={['/login?redirectTo=https%3A%2F%2Fevil.example']}><AuthProvider><App /></AuthProvider></MemoryRouter>);
  fireEvent.change(screen.getByLabelText(/E-mail/), { target: { value: 'dicky@example.com' } });
  fireEvent.change(screen.getByLabelText(/Kata Sandi/), { target: { value: 'rahasia' } });
  fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));
  expect(await screen.findByRole('heading', { name: 'Temukan ilmu baru melalui video pembelajaran interaktif.' })).toBeInTheDocument();
});