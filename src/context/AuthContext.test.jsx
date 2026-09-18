import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

function Probe() { return <span>{useAuth().user?.name}</span>; }

afterEach(() => { cleanup(); localStorage.clear(); });

function IdentityProbe() {
  const { user, login, logout, updateUser } = useAuth();
  return <><span data-testid="uid">{user?.uid || ''}</span>
    <button onClick={() => login('A', { email: 'a@example.com' })}>Login A</button>
    <button onClick={() => login('B', { email: 'b@example.com' })}>Login B</button>
    <button onClick={() => updateUser({ email: 'new-a@example.com' })}>Ubah Email A</button>
    <button onClick={() => login('A', { email: 'new-a@example.com' })}>Login Email Baru</button>
    <button onClick={logout}>Logout</button>
  </>;
}

test('retains a stable demo identity on this browser across logout and login', () => {
  render(<AuthProvider><IdentityProbe /></AuthProvider>);
  fireEvent.click(screen.getByText('Login A'));
  const firstId = screen.getByTestId('uid').textContent;
  expect(firstId).not.toBe('');
  fireEvent.click(screen.getByText('Logout'));
  fireEvent.click(screen.getByText('Login A'));
  expect(screen.getByTestId('uid')).toHaveTextContent(firstId);
  fireEvent.click(screen.getByText('Login B'));
  expect(screen.getByTestId('uid').textContent).not.toBe(firstId);
});

test('assigns and persists a uid for a legacy saved demo session', () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Legacy', isLoggedIn: true }));
  render(<AuthProvider><IdentityProbe /></AuthProvider>);
  expect(screen.getByTestId('uid').textContent).not.toBe('');
  expect(JSON.parse(localStorage.getItem('videobelajar-user')).uid).toBe(screen.getByTestId('uid').textContent);
});

test('keeps the uid when email is changed and the user logs in again without reloading', () => {
  render(<AuthProvider><IdentityProbe /></AuthProvider>);
  fireEvent.click(screen.getByText('Login A'));
  const uid = screen.getByTestId('uid').textContent;
  fireEvent.click(screen.getByText('Ubah Email A'));
  fireEvent.click(screen.getByText('Logout'));
  fireEvent.click(screen.getByText('Login Email Baru'));
  expect(screen.getByTestId('uid')).toHaveTextContent(uid);
});

test('restores a saved user', () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true }));
  render(<AuthProvider><Probe /></AuthProvider>);
  expect(screen.getByText('Dicky')).toBeInTheDocument();
});
