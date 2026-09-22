import { Route, Routes, useNavigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CourseDetailPage from './pages/CourseDetailPage';
import PaymentMethodPage from './pages/PaymentMethodPage';
import PaymentPage from './pages/PaymentPage';
import RequireAuth from './components/RequireAuth';
import OrdersPage from './pages/OrdersPage';
import ClassesPage from './pages/ClassesPage';
import ProfilePage from './pages/ProfilePage';
import PageBoundary from './components/PageBoundary';
import CatalogLayout from './components/CatalogLayout';
import OrdersLayout from './components/OrdersLayout';

const LearningPage = lazy(() => import('./pages/LearningPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const CertificatePage = lazy(() => import('./pages/CertificatePage'));
const ManageCoursesPage = lazy(() => import('./pages/ManageCoursesPage'));

function ProfileLinkRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const handleProfileClick = (event) => {
      const link = event.target.closest('a[aria-label="Profil Saya"]');
      if (!link) return;
      event.preventDefault();
      navigate('/profile');
    };
    document.addEventListener('click', handleProfileClick);
    return () => document.removeEventListener('click', handleProfileClick);
  }, [navigate]);
  return null;
}

export default function App() {
  return (
    <><ProfileLinkRedirect /><PageBoundary><Suspense fallback={<main className="container section"><p role="status">Memuat halaman...</p></main>}><Routes>
      <Route element={<CatalogLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/course/:slug" element={<CourseDetailPage />} />
      </Route>
      <Route element={<RequireAuth><CatalogLayout /></RequireAuth>}>
        <Route path="/manage-courses" element={<ManageCoursesPage />} />
        <Route path="/course/:slug/certificate" element={<CertificatePage />} />
        <Route element={<OrdersLayout />}>
          <Route path="/course/:slug/payment" element={<PaymentMethodPage />} />
          <Route path="/course/:slug/pay" element={<PaymentPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/classes" element={<ClassesPage />} />
        </Route>
        <Route path="/learn/:slug" element={<LearningPage />} />
        <Route path="/learn/:slug/quiz" element={<QuizPage />} />
        <Route path="/learn/:slug/pretest" element={<QuizPage />} />
        <Route path="/learn/:slug/exam" element={<QuizPage />} />
      </Route>
      <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes></Suspense></PageBoundary></>
  );
}
