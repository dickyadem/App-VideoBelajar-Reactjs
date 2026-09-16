import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import { courses } from '../data/courses';
import { courseDetails } from '../data/courseDetails';

beforeEach(() => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true, orders: courses.slice(0, 3).map((course) => ({ slug: course.slug, status: 'Berhasil' })) }));
  localStorage.setItem(`videobelajar-progress:Dicky:${courses[0].slug}`, JSON.stringify(['pretest', 'summary', 'quiz', 'exam', ...courseDetails[courses[0].slug].modules.flatMap((module) => module.lessons.map((lesson) => lesson.title))]));
});
afterEach(() => { cleanup(); localStorage.clear(); });

function open(path = '/classes') {
  render(<MemoryRouter initialEntries={[path]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
}

test('renders the classes page with progress cards', () => {
  open();
  expect(screen.getByRole('heading', { name: 'Daftar Kelas' })).toBeInTheDocument();
  expect(screen.getByLabelText('Kelas Saya')).toHaveAttribute('href', '/classes');
  expect(screen.getByRole('tab', { name: 'Semua Kelas' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getAllByRole('article')).toHaveLength(3);
  expect(screen.getByText('100%')).toBeInTheDocument();
});

test('filters running and completed classes', () => {
  open();
  fireEvent.click(screen.getByRole('tab', { name: 'Sedang Berjalan' }));
  expect(screen.getAllByRole('article', { name: /Kelas/ })).toHaveLength(2);
  fireEvent.click(screen.getByRole('tab', { name: 'Selesai' }));
  expect(screen.getAllByRole('article', { name: /Kelas/ })).toHaveLength(1);
  expect(screen.getByRole('link', { name: 'Unduh Sertifikat' })).toHaveAttribute('href', `/course/${courses[0].slug}/certificate`);
});

test('class actions open the video learning page', () => {
  open();
  expect(screen.getByRole('link', { name: 'Lihat Detail Kelas' })).toHaveAttribute('href', '/learn/big-4-auditor-financial-analyst');
  fireEvent.click(screen.getByRole('tab', { name: 'Sedang Berjalan' }));
  expect(screen.getAllByRole('link', { name: 'Lanjutkan Pembelajaran' })[0]).toHaveAttribute('href', '/learn/strategi-marketing-berbasis-data');
});

test('searches classes by title', () => {
  open();
  fireEvent.change(screen.getByRole('searchbox', { name: 'Cari Kelas' }), { target: { value: 'tidak ada' } });
  expect(screen.getByText('Kelas tidak ditemukan')).toBeInTheDocument();
});

test('redirects a guest to login', () => {
  localStorage.clear();
  open();
  expect(screen.getByRole('heading', { name: 'Masuk ke Akun' })).toBeInTheDocument();
});

test('only includes successful purchases without duplicate classes', () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true, orders: [
    { slug: courses[1].slug, status: 'Berhasil' },
    { slug: courses[1].slug, status: 'Berhasil' },
    { slug: courses[2].slug, status: 'Belum Bayar' },
    { slug: courses[0].slug, status: 'Gagal' },
  ] }));
  localStorage.setItem(`videobelajar-progress:Dicky:${courses[1].slug}`, JSON.stringify(['pretest']));
  open();
  expect(screen.getAllByRole('article')).toHaveLength(1);
  expect(screen.getByRole('article')).toHaveTextContent('1 / 11 Modul Terselesaikan');
  expect(screen.getByRole('article')).toHaveTextContent('9%');
  expect(screen.queryByRole('link', { name: 'Unduh Sertifikat' })).not.toBeInTheDocument();
});

test('shows an empty state before the first purchase', () => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true }));
  open();
  expect(screen.getByText('Belum ada kelas yang dibeli')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Jelajahi Kelas' })).toHaveAttribute('href', '/category');
});
