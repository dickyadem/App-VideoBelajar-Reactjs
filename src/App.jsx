import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
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
import LearningPage from './pages/LearningPage';
import QuizPage from './pages/QuizPage';
import CertificatePage from './pages/CertificatePage';
import CatalogLayout from './components/CatalogLayout';
import OrdersLayout from './components/OrdersLayout';

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
    <><ProfileLinkRedirect /><Routes>
      <Route element={<CatalogLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/course/:slug" element={<CourseDetailPage />} />
      </Route>
      <Route element={<RequireAuth><CatalogLayout /></RequireAuth>}>
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
    </Routes></>
  );
}
