import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CatalogProvider } from './context/CatalogContext';
import '../assets/css/global.css';
import '../assets/css/home.css';
import '../assets/css/responsive.css';
import '../assets/css/login.css';
import '../assets/css/register.css';
import '../assets/css/category.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter><AuthProvider><CatalogProvider><App /></CatalogProvider></AuthProvider></HashRouter>
  </StrictMode>,
);
