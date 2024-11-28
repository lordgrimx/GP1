/**
 * @file    App.tsx
 * @desc    Ana uygulama bileşeni
 * @details Uygulama rotalarını, tema yönetimini ve context yapılarını yöneten ana bileşen
 */

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FontSizeProvider } from './context/FontSizeContext';
import { Toaster } from 'react-hot-toast';

// Sayfa bileşenleri
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SubjectsPage from './pages/SubjectsPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import SolvedQuestionsPage from './pages/SolvedQuestionsPage';
import TestTrackPage from './pages/TestTrackPage';

// Yardımcı bileşenler
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CameraButton from './components/CameraButton';

/**
 * @component AppContent
 * @desc     Uygulama içeriğini ve rotaları yöneten alt bileşen
 * @returns  {JSX.Element} Router ve sayfa yapısı
 * 
 * @uses ThemeContext - Tema yönetimi için
 * @uses FontSizeContext - Yazı boyutu yönetimi için
 * @uses ToastContext - Bildirim yönetimi için
 */
function AppContent() {
  const { theme } = useTheme();
  const apiKey = import.meta.env.VITE_API_KEY as string;
  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <Router>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
        <Navbar />
        <div className="pt-20">
          <Routes>
            {/* Genel Rotalar */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Korumalı Rotalar */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/subjects" element={<ProtectedRoute><SubjectsPage /></ProtectedRoute>} />
            <Route path="/subjects/:id" element={<ProtectedRoute><SubjectDetailPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/testtrack" element={<ProtectedRoute><TestTrackPage /></ProtectedRoute>} />
            <Route 
              path="/solved-questions" 
              element={
                <ProtectedRoute>
                  <SolvedQuestionsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
        {isAuthenticated && (
          <CameraButton 
            apiKey={apiKey}
            model="gemini-1.5-flash-latest"
          />
        )}
      </div>
    </Router>
  );
}

/**
 * @component App
 * @desc     Ana uygulama bileşeni
 * @returns  {JSX.Element} Provider'lar ve AppContent bileşeni
 * 
 * @provides ThemeProvider - Tema context sağlayıcısı
 * @provides FontSizeProvider - Yazı boyutu context sağlayıcısı
 * @provides ToastProvider - Bildirim context sağlayıcısı
 */
function App() {
  return (
    <ThemeProvider>
      <FontSizeProvider> 
          <Toaster />
          <AppContent />
      </FontSizeProvider>
    </ThemeProvider>
  );
}

export default App;
