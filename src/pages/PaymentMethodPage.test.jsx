import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import { courses } from '../data/courses';

function open(path = `/course/${courses[0].slug}/payment`) {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true }));
  render(<MemoryRouter initialEntries={[path]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
}
beforeEach(() => vi.stubGlobal('scrollTo', vi.fn()));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

test.each(courses.map((course, i) => [course, [307000, 257000, 282000, 187000, 227000, 207000][i]]))('loads payment details for $slug', (course, total) => {
  open(`/course/${course.slug}/payment`);
  expect(screen.getByRole('heading', { name: 'Metode Pembayaran' })).toBeInTheDocument();
  const summary = screen.getByRole('complementary', { name: 'Ringkasan kelas' });
  expect(within(summary).getByRole('heading', { name: course.title })).toBeInTheDocument();
  expect(within(summary).getByText(course.price)).toBeInTheDocument();
  expect(screen.getByText('Total Harga (3 barang)')).toBeInTheDocument();
  expect(screen.getByText(`Rp ${total.toLocaleString('id-ID')}`)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Beli Sekarang' })).toBeDisabled();
});

test('shows bank payment options when the page opens', () => {
  open();
  expect(screen.getByRole('radio', { name: 'Bank BCA' })).toBeInTheDocument();
  expect(screen.getByRole('radio', { name: 'Bank BNI' })).toBeInTheDocument();
});

test('selects exactly one payment method across all groups', () => {
  open();
  expect(screen.getAllByRole('radio')).toHaveLength(4);
  for (const name of ['Bank BNI', 'Bank BRI', 'Bank Mandiri', 'Dana', 'OVO', 'LinkAja', 'Shopee Pay', 'Kartu Kredit/Debit', 'Bank BCA']) {
    if (name === 'Dana') fireEvent.click(screen.getByRole('button', { name: 'E-Wallet' }));
    if (name === 'Kartu Kredit/Debit') fireEvent.click(screen.getByRole('button', { name: 'Kartu Kredit/Debit' }));
    if (name === 'Bank BCA') fireEvent.click(screen.getByRole('button', { name: 'Transfer Bank' }));
    fireEvent.click(screen.getByRole('radio', { name }));
    expect(screen.getAllByRole('radio').filter((radio) => radio.checked)).toHaveLength(1);
    expect(screen.getByRole('radio', { name })).toBeChecked();
  }
});

test('collapses payment groups without losing the selected method', () => {
  open();
  fireEvent.click(screen.getByRole('button', { name: 'E-Wallet' }));
  fireEvent.click(screen.getByRole('radio', { name: 'OVO' }));
  const group = screen.getByRole('button', { name: /E-Wallet/ });
  fireEvent.click(group);
  expect(group).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('radio', { name: 'OVO' })).not.toBeInTheDocument();
  expect(group).toHaveTextContent('OVO');
  fireEvent.click(group);
  expect(screen.getByRole('radio', { name: 'OVO' })).toBeChecked();
});

test('opens payment for the selected course from its detail', () => {
  open(`/course/${courses[2].slug}`);
  fireEvent.click(screen.getByRole('link', { name: 'Beli Sekarang' }));
  expect(screen.getByRole('heading', { name: 'Metode Pembayaran' })).toBeInTheDocument();
  expect(screen.getByText('Rp 282.000')).toBeInTheDocument();
});

test('opens payment details after selecting the initial method', () => {
  open();
  fireEvent.click(screen.getByRole('radio', { name: 'Bank BCA' }));
  fireEvent.click(screen.getByRole('button', { name: 'Beli Sekarang' }));
  expect(screen.getByRole('heading', { name: 'Pembayaran' })).toBeInTheDocument();
});

test('returns to payment after changing the payment method', () => {
  open('/course/design-thinking-praktis/payment?change=1');
  fireEvent.click(screen.getByRole('button', { name: 'E-Wallet' }));
  fireEvent.click(screen.getByRole('radio', { name: 'Dana' }));
  fireEvent.click(screen.getByRole('button', { name: 'Bayar Sekarang' }));
  expect(screen.getByRole('heading', { name: 'Pembayaran' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Pembayaran Berhasil!' })).not.toBeInTheDocument();
});

test('shows the change method page as an actual payment step', () => {
  open('/course/design-thinking-praktis/payment?change=1');
  expect(screen.getByRole('heading', { name: 'Ubah Metode Pembayaran' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('radio', { name: 'Bank BCA' }));
  expect(screen.getByRole('button', { name: 'Bayar Sekarang' })).toBeEnabled();
});

test('handles missing courses without offering payment', () => {
  open('/course/tidak-ada/payment');
  expect(screen.getByRole('heading', { name: 'Kelas tidak ditemukan' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Beli Sekarang' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Jelajahi kelas' })).toHaveAttribute('href', '/category');
});
