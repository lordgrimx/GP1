// LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight } from 'lucide-react';
import { login } from '../api/api';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(formData.emailOrUsername, formData.password);
      if (response.token) {
        localStorage.setItem('token', response.token);
        toast.success('Giriş başarılı!', {
          duration: 2000,
          position: 'top-center',
        });
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      }
    } catch (error) {
      toast.error('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.', {
        duration: 2000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-md w-full space-y-4">
        <div className={`bg-white rounded-lg shadow-xl p-8 ${
          theme === 'dark' ? 'bg-gray-800/90' : 'bg-white'
        }`}>
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Giriş Yap
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="emailOrUsername" className={`block text-sm font-medium ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                E-posta veya Kullanıcı Adı
              </label>
              <input
                id="emailOrUsername"
                type="text"
                required
                value={formData.emailOrUsername}
                onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm
                  ${theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="E-posta veya kullanıcı adı"
              />
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Şifre
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm
                  ${theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Şifre"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg
                text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
                focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap →'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/register"
              className="text-sm text-blue-500 hover:text-blue-400 transition-colors duration-200"
            >
              Hesabınız yok mu? Kayıt olun
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
