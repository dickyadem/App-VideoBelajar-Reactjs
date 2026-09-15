import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

function Probe() { return <span>{useAuth().user?.name}</span>; }

test('restores a saved user', () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true }));
  render(<AuthProvider><Probe /></AuthProvider>);
  expect(screen.getByText('Dicky')).toBeInTheDocument();
});
