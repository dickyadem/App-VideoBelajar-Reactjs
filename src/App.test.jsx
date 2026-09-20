import { render } from './test/renderWithCatalog';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import App from './App';
import { AuthProvider } from './context/AuthContext';

test.each([
  ['/', 'Temukan ilmu baru melalui video pembelajaran interaktif.'],
  ['/login', 'Masuk ke Akun'],
  ['/register', 'Pendaftaran Akun'],
])('renders the %s route', (path, heading) => {
  render(<MemoryRouter initialEntries={[path]}><AuthProvider><App /></AuthProvider></MemoryRouter>);

  expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
});
