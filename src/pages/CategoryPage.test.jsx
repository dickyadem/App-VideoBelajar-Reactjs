import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, test } from 'vitest';
import CategoryPage from './CategoryPage';
import { AuthProvider } from '../context/AuthContext';

function renderPage() {
  return render(<MemoryRouter><AuthProvider><CategoryPage /></AuthProvider></MemoryRouter>);
}

afterEach(cleanup);

test('renders the category catalog and filters courses by search', () => {
  renderPage();
  expect(screen.getByRole('heading', { name: 'Koleksi Video Pembelajaran Unggulan' })).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(6);

  fireEvent.change(screen.getByPlaceholderText('Cari Kelas'), { target: { value: 'Marketing' } });
  expect(screen.getAllByRole('article')).toHaveLength(1);
});

test('filters courses when a study checkbox is selected', () => {
  renderPage();
  const studyFilter = screen.getAllByRole('group', { name: /Bidang Studi/ })[0];
  fireEvent.click(within(studyFilter).getByLabelText('Digital & Teknologi', { selector: 'input' }));
  expect(screen.getAllByRole('article')).toHaveLength(1);
  expect(screen.getByRole('heading', { name: 'Design Thinking Praktis' })).toBeInTheDocument();
});