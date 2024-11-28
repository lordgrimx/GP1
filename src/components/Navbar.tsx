import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, User, LogOut, ChevronDown, Settings, LayoutDashboard, Menu, X } from 'lucide-react';
import { getUserProfile } from '../api/api';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Token değişikliklerini dinlemek için useEffect
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    // Sayfa yüklendiğinde kontrol et
    checkAuth();

    // Token değişikliklerini dinle
    window.addEventListener('storage', checkAuth);
    
    // Custom event dinleyicisi ekle
    const handleLogout = () => {
      setIsAuthenticated(false);
      setUsername('');
      setProfileImage(null);
    };
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUsername('');
    setProfileImage(null);
    // Özel logout event'ini tetikle
    window.dispatchEvent(new Event('logout'));
    window.location.href = '/';
  };

  // Authenticated menu items'ı sadece giriş yapmış kullanıcılar için göster
  const menuItems = useMemo(() => {
    if (!isAuthenticated) {
      return [
        { path: '/login', title: 'Giriş Yap', icon: <User className="w-5 h-5" /> },
        { path: '/register', title: 'Kayıt Ol', icon: <BookOpen className="w-5 h-5" /> },
      ];
    }
    return [
      { path: '/dashboard', title: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      { path: '/testtrack', title: 'Deneme Takip', icon: <BookOpen className="w-5 h-5" /> },
    ];
  }, [isAuthenticated]);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        try {
          const response = await getUserProfile();
          setUsername(response.data.username);
          setProfileImage(response.data.profileImage);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [isAuthenticated]);

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className={`text-2xl font-bold ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-blue-500 to-white text-transparent bg-clip-text'
                  : 'bg-gradient-to-r from-blue-500 to-black text-transparent bg-clip-text'
              }`}>
                StudyMate
              </h1>
            </Link>
          </div>
          

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
            
            {isAuthenticated && (
              <div className="flex items-center gap-4">
                <Link
                  to="/subjects"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FaBook className="text-lg" />
                  Dersler
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <span>{username}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? 'transform rotate-180' : ''
                  }`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                    <div className={`rounded-md ring-1 ring-black ring-opacity-5 ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className={`block px-4 py-2 text-sm ${
                            theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <User className="w-4 h-4 inline-block mr-2" />
                          Profil
                        </Link>
                        <Link
                          to="/settings"
                          className={`block px-4 py-2 text-sm ${
                            theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4 inline-block mr-2" />
                          Ayarlar
                        </Link>
                        <button
                          onClick={handleLogout}
                          className={`flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 
                          ${theme === 'dark' ? 'hover:bg-red-900/30' : 'hover:bg-red-50'}`}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Çıkış Yap
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md ${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? theme === 'dark'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
