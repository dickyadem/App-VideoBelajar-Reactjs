import { render } from '../test/renderWithCatalog';
import { fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import HomePage from './HomePage';
import { AuthProvider } from '../context/AuthContext';

test('filters courses by category', () => {
  render(<MemoryRouter><AuthProvider><HomePage /></AuthProvider></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Desain' }));

  expect(screen.getByText('Design Thinking Praktis')).toBeInTheDocument();
  expect(screen.queryByText('Strategi Marketing Berbasis Data')).not.toBeInTheDocument();
});
