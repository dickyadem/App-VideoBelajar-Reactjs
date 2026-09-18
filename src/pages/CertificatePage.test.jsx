import { render } from '../test/renderWithCatalog';
import { cleanup, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, test } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import { courseDetails } from '../data/courseDetails';

const slug = 'big-4-auditor-financial-analyst';
afterEach(() => { cleanup(); localStorage.clear(); });
test.each([true, false])('certificate download requires completion: %s', (complete) => {
  localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true }));
  if (complete) localStorage.setItem(`videobelajar-progress:Dicky:${slug}`, JSON.stringify(['pretest', 'summary', 'quiz', 'exam', ...courseDetails[slug].modules.flatMap((module) => module.lessons.map((lesson) => lesson.title))]));
  render(<MemoryRouter initialEntries={[`/course/${slug}/certificate`]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
  if (complete) {
    expect(screen.getByRole('heading', { name: 'Big 4 Auditor Financial Analyst' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Sertifikat Dicky/ })).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Download Sertifikat/ });
    expect(link).toHaveAttribute('download', `sertifikat-${slug}.svg`);
    expect(decodeURIComponent(link.getAttribute('href'))).toContain('Dicky');
  } else {
    expect(screen.getByText('Selesaikan semua modul untuk mendapatkan sertifikat.')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Download Sertifikat/ })).not.toBeInTheDocument();
  }
});
