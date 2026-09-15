import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import CategoryTabs from './CategoryTabs';

test('reports the selected category', () => {
  const onChange = vi.fn();
  render(<CategoryTabs categories={[['all', 'Semua Kelas'], ['design', 'Desain']]} selectedCategory="all" onChange={onChange} />);

  fireEvent.click(screen.getByRole('button', { name: 'Desain' }));

  expect(onChange).toHaveBeenCalledWith('design');
});
