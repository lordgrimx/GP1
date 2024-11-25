
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SubjectsPage from './pages/SubjectsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import TestTrackPage from './pages/TestTrackPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './ToastContext'; // ToastProvider'ı içe aktarın

function App() {
  return (
    <ToastProvider> {/* ToastProvider uygulamanın en üst seviyesinde */}
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/subjects" element={<ProtectedRoute><SubjectsPage /></ProtectedRoute>} />
            <Route path="/testtrack" element={<ProtectedRoute><TestTrackPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
