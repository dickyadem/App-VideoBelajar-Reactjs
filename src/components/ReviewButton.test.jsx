import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

beforeEach(() => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true }));
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
});
afterEach(() => { cleanup(); localStorage.clear(); });

function open(path = '') {
  render(<MemoryRouter initialEntries={[`/learn/big-4-auditor-financial-analyst${path}`]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: /Beri Review & Rating/ }));
}

test.each(['', '/pretest', '/quiz', '/exam'])('opens and cancels review on %s', (path) => {
  open(path);
  expect(screen.getByRole('dialog', { name: 'Tulis Review Terbaikmu!' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('saves rating and review, restores them after remount, and discards cancelled edits', () => {
  open();
  expect(screen.getByRole('button', { name: 'Selesai' })).toBeDisabled();
  fireEvent.click(screen.getByRole('radio', { name: '4 bintang' }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Review' }), { target: { value: 'Materinya mudah dipahami.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Selesai' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('Review tersimpan');
  cleanup();
  open();
  expect(screen.getByRole('radio', { name: '4 bintang' })).toBeChecked();
  expect(screen.getByRole('textbox')).toHaveValue('Materinya mudah dipahami.');
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Batal disimpan' } });
  fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
  fireEvent.click(screen.getByRole('button', { name: /Beri Review & Rating/ }));
  expect(screen.getByRole('textbox')).toHaveValue('Materinya mudah dipahami.');
});
