import { StrictMode } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import Navbar from './components/Navbar';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FontSizeProvider } from './context/FontSizeContext';
import { Toaster } from 'react-hot-toast';
import { ToastProvider } from './ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import CameraButton from './components/CameraButton';
import TestTrackPage from './pages/TestTrackPage';
import SubjectsPage from './pages/SubjectsPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import SolvedQuestionsPage from './pages/SolvedQuestionsPage';

// Ana uygulama içeriğini ayrı bir bileşene taşıyalım
function AppContent() {
  const { theme } = useTheme();
  const apiKey = import.meta.env.VITE_API_KEY as string;

  return (
    <Router>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
        <Navbar />
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
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
        <CameraButton 
          apiKey={apiKey}
          model="gemini-1.5-pro"
        />
      </div>
    </Router>
  );
}

// Ana App bileşeni
function App() {
  return (
    <ThemeProvider>
      <FontSizeProvider>
        <ToastProvider>
          <Toaster />
          <AppContent />
        </ToastProvider>
      </FontSizeProvider>
    </ThemeProvider>
  );
}

export default App;
