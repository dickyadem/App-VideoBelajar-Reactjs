import { createContext, useContext, useEffect, useState } from 'react';
import { getCatalog } from '../services/catalogService';

export const CatalogContext = createContext(null);
const emptyCatalog = { courses: [], courseDetails: {}, categories: [], paymentGroups: [] };

export function CatalogProvider({ children }) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ data: emptyCatalog, loading: true, error: '' });

  useEffect(() => {
    let active = true;
    async function load() {
      setState({ data: emptyCatalog, loading: true, error: '' });
      try {
        const data = await getCatalog();
        if (active) setState({ data, loading: false, error: '' });
      } catch {
        if (active) setState({ data: emptyCatalog, loading: false, error: 'Gagal memuat data kelas. Silakan coba lagi.' });
      }
    }
    load();
    return () => { active = false; };
  }, [attempt]);

  return <CatalogContext.Provider value={{ ...state.data, loading: state.loading, error: state.error, reload: () => setAttempt((value) => value + 1) }}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const catalog = useContext(CatalogContext);
  if (!catalog) throw new Error('useCatalog harus digunakan di dalam CatalogProvider');
  return catalog;
}
