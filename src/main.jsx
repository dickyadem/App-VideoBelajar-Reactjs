import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { seedCourses } from './services/courseService';
import '../assets/css/global.css';
import '../assets/css/home.css';
import '../assets/css/responsive.css';
import '../assets/css/login.css';
import '../assets/css/register.css';
import '../assets/css/category.css';

seedCourses()
  .then(() => console.log('Semua data course berhasil masuk Firebase'))
  .catch((error) => console.error('Gagal mengisi Firebase:', error));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter><AuthProvider><App /></AuthProvider></HashRouter>
  </StrictMode>,
);
