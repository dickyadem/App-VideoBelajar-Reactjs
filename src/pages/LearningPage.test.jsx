import { render } from '../test/renderWithCatalog';
import { waitFor, cleanup, fireEvent, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

beforeEach(() => localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true })));
afterEach(() => { cleanup(); localStorage.clear(); });

async function open(path = '/learn/big-4-auditor-financial-analyst') {
  render(<MemoryRouter initialEntries={[path]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
  await waitFor(() => expect(screen.queryByText('Memuat halaman...')).not.toBeInTheDocument());
}

test('completed lessons show a check after next and after reopening the page', async () => {
  await open();
  const sidebar = within(screen.getByRole('complementary', { name: 'Daftar modul' }));
  const lesson = sidebar.getByRole('button', { name: /Memahami neraca dan laba rugi/ });
  fireEvent.click(lesson);
  expect(within(lesson).queryByRole('img', { name: 'Selesai' })).not.toBeInTheDocument();
  fireEvent.click(within(screen.getByRole('contentinfo')).getAllByRole('button')[1]);
  expect(within(lesson).getByRole('img', { name: 'Selesai' })).toBeInTheDocument();
  const nextLesson = sidebar.getByRole('button', { name: /Membaca laporan arus kas/ });
  expect(nextLesson).toHaveClass('is-selected');
  expect(within(nextLesson).queryByRole('img', { name: 'Selesai' })).not.toBeInTheDocument();
  cleanup();
  await open();
  expect(within(screen.getByRole('complementary', { name: 'Daftar modul' })).getByRole('img', { name: 'Selesai' })).toBeInTheDocument();
});

test('opens summary before quiz and provides a course-specific download', async () => {
  await open();
  const sidebar = within(screen.getByRole('complementary', { name: 'Daftar modul' }));
  fireEvent.click(sidebar.getByRole('button', { name: /Rangkuman:/ }));
  expect(screen.getByRole('heading', { name: 'Download Rangkuman Modul' })).toBeInTheDocument();
  const download = screen.getByRole('link', { name: /Download Rangkuman/ });
  expect(download).toHaveAttribute('download', 'rangkuman-big-4-auditor-financial-analyst.txt');
  const content = decodeURIComponent(download.getAttribute('href').split(',')[1]);
  expect(content).toContain('Big 4 Auditor Financial Analyst');
  expect(content).toContain('Dasar Laporan Keuangan');
  expect(content).toContain('Membaca laporan arus kas');
  const [previous, next] = within(screen.getByRole('contentinfo')).getAllByRole('button');
  expect(previous).toHaveTextContent('Presentasi analisis perusahaan');
  expect(next).toHaveTextContent('Quiz:');
  fireEvent.click(next);
  expect(await screen.findByRole('button', { name: 'Mulai Quiz' })).toBeInTheDocument();
  fireEvent.click(previous);
  expect(screen.getByRole('heading', { name: 'Download Rangkuman Modul' })).toBeInTheDocument();
});

test('opens purchased course at the first item, Pre-Test', async () => {
  await open();
  expect(screen.getByRole('heading', { name: 'Aturan' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Mulai Pre-Test' })).toBeInTheDocument();
  expect(within(screen.getByRole('complementary', { name: 'Daftar modul' })).getByRole('button', { name: /Pre-Test:/ })).toHaveClass('is-selected');
  const [previous, next] = within(screen.getByRole('contentinfo')).getAllByRole('button');
  expect(previous).toBeDisabled();
  expect(next).toHaveTextContent('Memahami neraca dan laba rugi');
  expect(screen.getByRole('complementary', { name: 'Daftar modul' })).toBeInTheDocument();
  expect(screen.queryByText('0% Modul Telah Selesai')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Lihat progres modul/ }));
  expect(screen.getByText('0% Modul Telah Selesai')).toBeInTheDocument();
  fireEvent.pointerDown(document.body);
  expect(screen.queryByText('0% Modul Telah Selesai')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Lihat progres modul/ }));
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByText('0% Modul Telah Selesai')).not.toBeInTheDocument();
});

test('selects another lesson from the module list', async () => {
  await open();
  fireEvent.click(within(screen.getByRole('complementary', { name: 'Daftar modul' })).getByRole('button', { name: /Membaca laporan arus kas/ }));
  expect(screen.getByRole('heading', { name: 'Membaca laporan arus kas' })).toBeInTheDocument();
});

test('redirects a guest to login', async () => {
  localStorage.clear();
  await open();
  expect(screen.getByRole('heading', { name: 'Masuk ke Akun' })).toBeInTheDocument();
});

test('opens quiz and final exam assessment states', async () => {
  await open();
  fireEvent.click(screen.getByRole('button', { name: /Quiz:/ }));
  expect(screen.getByRole('heading', { name: 'Aturan' })).toBeInTheDocument();
  expect(await screen.findByRole('button', { name: 'Mulai Quiz' })).toBeInTheDocument();
  fireEvent.click(within(screen.getByRole('complementary', { name: 'Daftar modul' })).getByRole('button', { name: /Ujian Akhir:/ }));
  expect(screen.getByRole('button', { name: 'Mulai Ujian Akhir' })).toBeInTheDocument();
});

test('bottom navigation follows the entire module list forwards and backwards', async () => {
  await open();
  const sidebar = within(screen.getByRole('complementary', { name: 'Daftar modul' }));
  const items = sidebar.getAllByRole('button').filter((button) => button.querySelector('small'));
  const titles = items.map((button) => button.querySelector('small').parentElement.firstChild.textContent);
  const [previous, next] = within(screen.getByRole('contentinfo')).getAllByRole('button');

  fireEvent.click(items[0]);
  expect(previous).toBeDisabled();
  for (let index = 1; index < items.length; index += 1) {
    expect(next).toHaveTextContent(titles[index]);
    fireEvent.click(next);
    expect(items[index]).toHaveClass('is-selected');
  }
  expect(next).toBeDisabled();
  for (let index = items.length - 2; index >= 0; index -= 1) {
    expect(previous).toHaveTextContent(titles[index]);
    fireEvent.click(previous);
    expect(items[index]).toHaveClass('is-selected');
  }
  expect(previous).toBeDisabled();
});
