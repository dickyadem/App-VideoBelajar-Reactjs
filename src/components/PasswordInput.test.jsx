import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import PasswordInput from './PasswordInput';

test('toggles password visibility', () => {
  render(<PasswordInput id="password" label="Kata Sandi" value="secret" onChange={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Tampilkan' }));
  expect(screen.getByLabelText(/Kata Sandi/)).toHaveAttribute('type', 'text');
});
