import { createContext, useContext } from 'react';
import { getCatalog } from '../services/catalogService';
import { useAsyncResource } from '../hooks/useAsyncResource';

export const CatalogContext = createContext(null);
const emptyCatalog = { courses: [], courseDetails: {}, categories: [], paymentGroups: [] };

export function CatalogProvider({ children }) {
  const state = useAsyncResource(getCatalog, emptyCatalog, 'Gagal memuat data kelas. Silakan coba lagi.');

  return <CatalogContext.Provider value={{ ...state.data, loading: state.loading, error: state.error, reload: state.reload }}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const catalog = useContext(CatalogContext);
  if (!catalog) throw new Error('useCatalog harus digunakan di dalam CatalogProvider');
  return catalog;
}
