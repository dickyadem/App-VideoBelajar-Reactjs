import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import PageBoundary from './PageBoundary';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

test('offers reload when a page or dynamic import fails', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  function BrokenPage() { throw new Error('Chunk unavailable'); }
  render(<PageBoundary><BrokenPage /></PageBoundary>);
  expect(screen.getByRole('alert')).toHaveTextContent('Halaman tidak dapat ditampilkan');
  expect(screen.getByRole('button', { name: 'Muat ulang' })).toBeInTheDocument();
});
