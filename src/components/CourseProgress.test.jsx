import { render } from '../test/renderWithCatalog';
import { waitFor, cleanup, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import { courseDetails } from '../data/courseDetails';

const slug = 'big-4-auditor-financial-analyst';
const key = `videobelajar-progress:Dicky:${slug}`;
const prerequisites = ['pretest', 'summary', 'quiz', ...courseDetails[slug].modules.flatMap((module) => module.lessons.map((lesson) => lesson.title))];
beforeEach(() => localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true })));
afterEach(() => { cleanup(); localStorage.clear(); });

test.each([[true, true], [true, false], [false, true]])('certificate needs all modules (%s) and a passing exam (%s)', async (allModules, passed) => {
  localStorage.setItem(key, JSON.stringify(allModules ? prerequisites : ['pretest']));
  render(<MemoryRouter initialEntries={[`/learn/${slug}/exam`]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
  await waitFor(() => expect(screen.queryByText('Memuat halaman...')).not.toBeInTheDocument());
  if (passed) for (let index = 1; index <= 10; index++) {
    fireEvent.click(screen.getByRole('button', { name: String(index) }));
    fireEvent.click(screen.getAllByRole('radio')[0]);
  }
  fireEvent.click(screen.getByRole('button', { name: '10' }));
  fireEvent.click(screen.getByRole('button', { name: /^Selesaikan/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Selesai' }));
  if (allModules && passed) {
    expect(screen.getByText('Modul sudah selesai')).toBeVisible();
    expect(screen.getByText(/11 dari 11 modul/)).toBeVisible();
    expect(screen.getByRole('link', { name: 'Ambil Sertifikat' })).toHaveAttribute('href', `/course/${slug}/certificate`);
    expect(JSON.parse(localStorage.getItem(key))).toContain('exam');
    fireEvent.click(screen.getByRole('button', { name: /Ambil Sertifikat/ }));
    expect(screen.queryByText('Modul sudah selesai')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Ambil Sertifikat/ }));
    expect(screen.getByText('Modul sudah selesai')).toBeVisible();
  } else expect(screen.queryByText('Modul sudah selesai')).not.toBeInTheDocument();
});
