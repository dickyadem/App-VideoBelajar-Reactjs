import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, test } from 'vitest';
import LoginPage from './LoginPage';
import { AuthProvider } from '../context/AuthContext';

beforeEach(() => {
  localStorage.clear();
});

test('signs in after a valid login', () => {
  render(<MemoryRouter><AuthProvider><LoginPage /></AuthProvider></MemoryRouter>);
  fireEvent.change(screen.getByLabelText(/E-mail/), { target: { value: 'dicky@example.com' } });
  fireEvent.change(screen.getByLabelText(/Kata Sandi/), { target: { value: 'rahasia' } });
  fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));
  expect(localStorage.getItem('videobelajar-user')).toContain('dicky');
});