import { Outlet } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import Header from './Header';
import Footer from './Footer';
import AsyncContent from './AsyncContent';

export default function CatalogLayout() {
  const { loading, error, reload } = useCatalog();
  if (!loading && !error) return <Outlet />;

  return <><Header /><main className="container section">
    <AsyncContent loading={loading} error={error} loadingMessage="Memuat data kelas..." onRetry={reload} />
  </main><Footer /></>;
}
