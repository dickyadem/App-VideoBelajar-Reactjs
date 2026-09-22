import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../store/redux/coursesReducer';

export const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses);
  const catalog = useSelector((state) => state.catalog);
  useEffect(() => { dispatch(fetchCourses()); }, [dispatch]);
  return <CatalogContext.Provider value={{ ...catalog, courses, loading: ['idle', 'loading'].includes(catalog.status), reload: () => dispatch(fetchCourses()) }}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const catalog = useContext(CatalogContext);
  if (!catalog) throw new Error('useCatalog harus digunakan di dalam CatalogProvider');
  return catalog;
}
