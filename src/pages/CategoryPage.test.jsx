import { render } from '../test/renderWithCatalog';
import { cleanup, fireEvent, screen, within } from '@testing-library/react';
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
  expect(screen.getAllByRole('article')).toHaveLength(4);

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

test('filters courses by price', () => {
  renderPage();
  const priceFilter = screen.getAllByRole('group', { name: 'Harga' })[0];
  fireEvent.click(within(priceFilter).getByLabelText('Di bawah Rp 200K', { selector: 'input' }));
  expect(screen.getAllByRole('article')).toHaveLength(1);
  expect(screen.getByRole('heading', { name: 'Fokus dan Produktif Setiap Hari' })).toBeInTheDocument();
});

test('filters courses by duration', () => {
  renderPage();
  const durationFilter = screen.getAllByRole('group', { name: 'Durasi' })[0];
  fireEvent.click(within(durationFilter).getByLabelText('Kurang dari 4 Jam', { selector: 'input' }));
  expect(screen.getAllByRole('article')).toHaveLength(4);
});

test('paginates with numbered buttons and arrows at the page boundaries', () => {
  renderPage();
  const pagination = screen.getByRole('navigation', { name: 'Paginasi' });
  expect(within(pagination).getAllByRole('button')).toHaveLength(4);
  expect(screen.getByRole('button', { name: 'Halaman sebelumnya' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Halaman berikutnya' }));
  expect(screen.getAllByRole('article')).toHaveLength(2);
  expect(screen.getByRole('heading', { name: 'Content Planning yang Konsisten' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Big 4 Auditor Financial Analyst' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Halaman berikutnya' })).toBeDisabled();
  expect(within(pagination).getByRole('button', { name: '2', exact: true })).toHaveAttribute('aria-current', 'page');
  fireEvent.click(screen.getByRole('button', { name: 'Halaman sebelumnya' }));
  expect(screen.getAllByRole('article')).toHaveLength(4);
  fireEvent.click(within(pagination).getByRole('button', { name: '2', exact: true }));
  expect(screen.getAllByRole('article')).toHaveLength(2);
  fireEvent.click(within(pagination).getByRole('button', { name: '1', exact: true }));
  expect(screen.getAllByRole('article')).toHaveLength(4);
});

test.each(['search', 'study', 'category', 'sort', 'reset'])('returns to the first page after %s changes', (control) => {
  renderPage();
  fireEvent.click(screen.getByRole('button', { name: 'Halaman berikutnya' }));
  if (control === 'search') fireEvent.change(screen.getByPlaceholderText('Cari Kelas'), { target: { value: 'Design' } });
  if (control === 'study') fireEvent.click(within(screen.getByRole('group', { name: /Bidang Studi/ })).getByLabelText('Digital & Teknologi'));
  if (control === 'category') fireEvent.click(screen.getByRole('button', { name: 'Digital & Teknologi' }));
  if (control === 'sort') fireEvent.change(screen.getByRole('combobox', { name: 'Urutkan' }), { target: { value: 'price' } });
  if (control === 'reset') fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
  const pagination = screen.getByRole('navigation', { name: 'Paginasi' });
  expect(within(pagination).getByRole('button', { name: '1', exact: true })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('button', { name: 'Halaman sebelumnya' })).toBeDisabled();
  expect(screen.getAllByRole('article')).toHaveLength(['sort', 'reset'].includes(control) ? 4 : 1);
  if (control === 'sort') expect(screen.getAllByRole('article')[0]).toHaveTextContent('Fokus dan Produktif Setiap Hari');
});

test('shows an empty state without pagination when no courses match', () => {
  renderPage();
  fireEvent.click(screen.getByRole('button', { name: 'Halaman berikutnya' }));
  fireEvent.change(screen.getByPlaceholderText('Cari Kelas'), { target: { value: 'tidak-ada-kelas' } });
  expect(screen.queryAllByRole('article')).toHaveLength(0);
  expect(screen.getByText('Tidak ada kelas yang sesuai. Coba pencarian atau filter lain.')).toBeInTheDocument();
  expect(screen.queryByRole('navigation', { name: 'Paginasi' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
  expect(screen.getAllByRole('article')).toHaveLength(4);
});
