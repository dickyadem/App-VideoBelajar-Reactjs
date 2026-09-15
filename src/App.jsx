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
      <Route path="/" element={<HomePage />} />
      <Route path="/category" element={<CategoryPage />} />
      <Route path="/course/:slug" element={<CourseDetailPage />} />
      <Route path="/course/:slug/certificate" element={<RequireAuth><CertificatePage /></RequireAuth>} />
      <Route path="/course/:slug/payment" element={<RequireAuth><PaymentMethodPage /></RequireAuth>} />
      <Route path="/course/:slug/pay" element={<RequireAuth><PaymentPage /></RequireAuth>} />
      <Route path="/orders" element={<RequireAuth><OrdersPage /></RequireAuth>} />
      <Route path="/classes" element={<RequireAuth><ClassesPage /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="/learn/:slug" element={<RequireAuth><LearningPage /></RequireAuth>} />
      <Route path="/learn/:slug/quiz" element={<RequireAuth><QuizPage /></RequireAuth>} />
      <Route path="/learn/:slug/pretest" element={<RequireAuth><QuizPage /></RequireAuth>} />
      <Route path="/learn/:slug/exam" element={<RequireAuth><QuizPage /></RequireAuth>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes></>
  );
}
