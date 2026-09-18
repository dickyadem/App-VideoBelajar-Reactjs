import { render } from '../test/renderWithCatalog';
import { waitFor, cleanup, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test } from 'vitest';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

beforeEach(() => localStorage.setItem('videobelajar-user', JSON.stringify({ name: 'Dicky', isLoggedIn: true })));
afterEach(() => { cleanup(); localStorage.clear(); });

async function open(assessment = 'quiz') {
  render(<MemoryRouter initialEntries={[`/learn/big-4-auditor-financial-analyst/${assessment}`]}><AuthProvider><App /></AuthProvider></MemoryRouter>);
  await waitFor(() => expect(screen.queryByText('Memuat halaman...')).not.toBeInTheDocument());
}

test('renders the first quiz question and question list', async () => {
  await open();
  expect(screen.getByRole('heading', { name: /Pertanyaan 1$/ })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'List Soal' })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /^[0-9]+$/ })).toHaveLength(10);
  expect(screen.getByRole('button', { name: 'Selanjutnya' })).toBeInTheDocument();
});

test('moves through questions and finishes on the last question', async () => {
  await open();
  fireEvent.click(screen.getByRole('button', { name: 'Selanjutnya' }));
  expect(screen.getByRole('heading', { name: /Pertanyaan 2$/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '10' }));
  expect(screen.getByRole('heading', { name: /Pertanyaan 10$/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^Selesaikan/  })).toBeInTheDocument();
});

test('selects an answer and marks the question as answered', async () => {
  await open();
  fireEvent.click(screen.getByRole('radio', { name: /Memikirkan tentang default/ }));
  expect(screen.getByRole('radio', { name: /Memikirkan tentang default/ })).toBeChecked();
  expect(screen.getByRole('button', { name: '1' })).toHaveClass('is-answered');
});

test('confirms finishing the assessment with a dynamic modal', async () => {
  await open();
  fireEvent.click(screen.getByRole('button', { name: '10' }));
  fireEvent.click(screen.getByRole('button', { name: /^Selesaikan/  }));
  expect(screen.getByRole('heading', { name: 'Selesaikan Quiz' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Batal' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
  expect(screen.queryByRole('heading', { name: 'Selesaikan Quiz' })).not.toBeInTheDocument();
});

test('shows a completed result after confirming submit', async () => {
  await open();
  for (let question = 1; question <= 10; question += 1) {
    fireEvent.click(screen.getByRole('button', { name: String(question) }));
    fireEvent.click(screen.getByRole('radio', { name: /Memikirkan tentang default/ }));
  }
  fireEvent.click(screen.getByRole('button', { name: /^Selesaikan/  }));
  fireEvent.click(screen.getByRole('button', { name: 'Selesai' }));
  expect(screen.getByRole('heading', { name: 'Selesai!' })).toBeInTheDocument();
  expect(screen.getByText('Nilai')).toBeInTheDocument();
});

test('shows try again when the score is below the passing grade', async () => {
  await open();
  fireEvent.click(screen.getByRole('button', { name: '10' }));
  fireEvent.click(screen.getByRole('button', { name: /^Selesaikan/  }));
  fireEvent.click(screen.getByRole('button', { name: 'Selesai' }));
  expect(screen.getByRole('heading', { name: 'Sedikit Lagi!' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Ulangi Quiz' })).toBeInTheDocument();
});

test('passes when at least six answers are correct', async () => {
  await open();
  for (let question = 1; question <= 6; question += 1) {
    fireEvent.click(screen.getByRole('button', { name: String(question) }));
    fireEvent.click(screen.getByRole('radio', { name: /Memikirkan tentang default/ }));
  }
  fireEvent.click(screen.getByRole('button', { name: '10' }));
  fireEvent.click(screen.getByRole('button', { name: /^Selesaikan/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Selesai' }));
  expect(screen.getByRole('heading', { name: 'Selesai!' })).toBeInTheDocument();
  expect(screen.getByText('60')).toBeInTheDocument();
});

test.each([['pretest', 'Pre-Test'], ['quiz', 'Quiz'], ['exam', 'Ujian Akhir']])('retry %s returns to its submodule and starts a fresh attempt', async (assessment, title) => {
  await open(assessment);
  fireEvent.click(screen.getAllByRole('radio')[0]);
  fireEvent.click(screen.getByRole('button', { name: '10' }));
  fireEvent.click(screen.getByRole('button', { name: /^Selesaikan/  }));
  fireEvent.click(screen.getByRole('button', { name: 'Selesai' }));
  fireEvent.click(screen.getByRole('button', { name: `Ulangi ${title}` }));
  expect(await screen.findByRole('heading', { name: 'Aturan' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: `Mulai ${title}` }));
  expect(screen.getByRole('heading', { name: /Pertanyaan 1$/ })).toBeInTheDocument();
  screen.getAllByRole('radio').forEach((radio) => expect(radio).not.toBeChecked());
  expect(screen.getByRole('button', { name: '1' })).not.toHaveClass('is-answered');
});
