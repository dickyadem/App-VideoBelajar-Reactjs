import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
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
