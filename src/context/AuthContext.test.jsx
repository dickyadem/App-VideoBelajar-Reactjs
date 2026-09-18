import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

function Probe() { return <span>{useAuth().user?.name}</span>; }

afterEach(() => { cleanup(); localStorage.clear(); });

function IdentityProbe() {
  const { user, login, logout } = useAuth();
  return <><span data-testid="uid">{user?.uid || ''}</span>
    <button onClick={() => login('a@example.com', 'rahasia')}>Login A</button>
    <button onClick={() => login('b@example.com', 'rahasia')}>Login B</button>
    <button onClick={logout}>Logout</button>
  </>;
}

test('uses stable Firebase UID for the same account across logout and login', async () => {
  render(<AuthProvider><IdentityProbe /></AuthProvider>);
  fireEvent.click(screen.getByText('Login A'));
  const firstId = await screen.findByTestId('uid').then((element) => element.textContent);
  expect(firstId).toBe('uid-a@example.com');
  fireEvent.click(screen.getByText('Logout'));
  fireEvent.click(screen.getByText('Login A'));
  expect(await screen.findByTestId('uid')).toHaveTextContent(firstId);
  fireEvent.click(screen.getByText('Login B'));
  expect(await screen.findByTestId('uid')).not.toHaveTextContent(firstId);
});

test('starts signed out until Firebase restores a session', () => {
  render(<AuthProvider><Probe /></AuthProvider>);
  expect(screen.queryByText('Dicky')).not.toBeInTheDocument();
});
