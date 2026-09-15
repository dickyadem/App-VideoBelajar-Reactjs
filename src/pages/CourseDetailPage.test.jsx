import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import { courses } from '../data/courses';

const slugs = ['big-4-auditor-financial-analyst', 'strategi-marketing-berbasis-data', 'design-thinking-praktis', 'fokus-dan-produktif-setiap-hari', 'bangun-tim-yang-kolaboratif', 'content-planning-yang-konsisten'];
function open(path) {
  return render(<MemoryRouter initialEntries={[path]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
}
beforeEach(() => vi.stubGlobal('scrollTo', vi.fn()));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

test.each(slugs.map((slug, index) => [slug, index]))('renders detail for %s', (slug, index) => {
  open(`/course/${slug}`);
  expect(screen.getByRole('heading', { level: 1, name: courses[index].title })).toBeInTheDocument();
  const purchase = screen.getByRole('complementary', { name: 'Informasi pembelian' });
  expect(within(purchase).getByText(courses[index].price)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Kamu akan Mempelajari' })).toBeInTheDocument();
  const sections = document.querySelectorAll('details');
  expect(sections.length).toBeGreaterThan(1);
  expect(sections[0]).toHaveAttribute('open');
  expect(sections[1]).not.toHaveAttribute('open');
});

test('opens a course from the home page', () => {
  open('/');
  fireEvent.click(screen.getByRole('link', { name: courses[0].title }));
  expect(screen.getByRole('heading', { level: 1, name: courses[0].title })).toBeInTheDocument();
});

test('handles an unknown course with a catalog link', () => {
  open('/course/tidak-ada');
  expect(screen.getByRole('heading', { name: 'Kelas tidak ditemukan' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Jelajahi kelas' })).toHaveAttribute('href', '/category');
});

test('related courses exclude the current course and navigate to another detail', () => {
  open(`/course/${slugs[0]}`);
  const related = screen.getByRole('region', { name: 'Video Pembelajaran Terkait Lainnya' });
  expect(within(related).getAllByRole('article')).toHaveLength(3);
  expect(within(related).queryByRole('link', { name: courses[0].title })).not.toBeInTheDocument();
  fireEvent.click(within(related).getByRole('link', { name: courses[4].title }));
  expect(screen.getByRole('heading', { level: 1, name: courses[4].title })).toBeInTheDocument();
});

test('purchase opens the payment method page first', () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true }));
  open(`/course/${slugs[0]}`);
  fireEvent.click(screen.getByRole('link', { name: 'Beli Sekarang' }));
  expect(screen.getByRole('heading', { name: 'Metode Pembayaran' })).toBeInTheDocument();
});

test('starts the next course at the top and clears previous share feedback', async () => {
  open(`/course/${slugs[0]}`);
  vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  fireEvent.click(screen.getByRole('button', { name: 'Bagikan Kelas' }));
  await screen.findByText('Tautan kelas berhasil disalin.');
  const related = screen.getByRole('region', { name: 'Video Pembelajaran Terkait Lainnya' });
  window.scrollTo.mockClear();
  fireEvent.click(within(related).getByRole('link', { name: courses[4].title }));
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
  expect(screen.getByRole('status')).toBeEmptyDOMElement();
});

test('copies a shareable course URL', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', { clipboard: { writeText } });
  open(`/course/${slugs[0]}`);
  fireEvent.click(screen.getByRole('button', { name: 'Bagikan Kelas' }));
  expect(await screen.findByText('Tautan kelas berhasil disalin.')).toBeInTheDocument();
  expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/course/${slugs[0]}`);
});

test.each([undefined, { writeText: () => Promise.reject(new Error('denied')) }])('offers a manual share link when clipboard fails', async (clipboard) => {
  vi.stubGlobal('navigator', { clipboard });
  open(`/course/${slugs[0]}`);
  fireEvent.click(screen.getByRole('button', { name: 'Bagikan Kelas' }));
  expect(await screen.findByRole('textbox', { name: 'Tautan kelas' })).toHaveValue(`${window.location.origin}/course/${slugs[0]}`);
});
