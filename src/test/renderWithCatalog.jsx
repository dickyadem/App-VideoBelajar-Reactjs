import { render as renderUI, screen, waitFor } from '@testing-library/react';
import { expect } from 'vitest';
import { CatalogContext } from '../context/CatalogContext';
import { courses } from '../data/courses';
import { courseDetails } from '../data/courseDetails';
import { paymentGroups } from '../data/paymentMethods';

// Static fixtures isolate existing UI interaction tests from network requests.
// catalog.integration.test.jsx separately exercises the real loading/provider flow.
const catalog = {
  courses,
  courseDetails,
  paymentGroups,
  categories: [['marketing', 'Pemasaran'], ['design', 'Desain'], ['personal', 'Pengembangan Diri'], ['business', 'Bisnis']],
  loading: false,
  error: '',
};

export function render(ui, options) {
  return renderUI(<CatalogContext.Provider value={catalog}>{ui}</CatalogContext.Provider>, options);
}

export async function waitForOrders() {
  await waitFor(() => expect(screen.queryByText('Memuat pesanan...')).not.toBeInTheDocument());
}
