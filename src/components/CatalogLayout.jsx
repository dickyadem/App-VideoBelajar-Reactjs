import { Outlet } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import Header from './Header';
import Footer from './Footer';

export default function CatalogLayout() {
  const { loading, error, reload } = useCatalog();
  if (!loading && !error) return <Outlet />;

  return <><Header /><main className="container section">
    {loading ? <p role="status">Memuat data kelas...</p> : <>
      <p role="alert">{error}</p>
      <button className="btn btn-primary" type="button" onClick={reload}>Coba lagi</button>
    </>}
  </main><Footer /></>;
}
