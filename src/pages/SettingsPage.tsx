import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun, FaBell, FaLock } from 'react-icons/fa';
import { useFontSize } from '../context/FontSizeContext';
import { FaFont } from 'react-icons/fa';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-8 dark:text-white">Ayarlar</h1>
          
          <div className="space-y-6">
            {/* Tema Ayarı */}
            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                {theme === 'dark' ? 
                  <FaMoon className="text-2xl text-blue-500" /> : 
                  <FaSun className="text-2xl text-yellow-500" />
                }
                <span className="text-lg font-medium">Tema Modu</span>
              </div>
              <button
                onClick={toggleTheme}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}
              </button>
            </div>

            {/* Font Boyutu Ayarı */}
            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <FaFont className="text-2xl text-blue-500" />
                <span className="text-lg font-medium">Yazı Boyutu</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFontSize('small')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    fontSize === 'small'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                >
                  Küçük
                </button>
                <button
                  onClick={() => setFontSize('medium')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    fontSize === 'medium'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                >
                  Orta
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    fontSize === 'large'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                >
                  Büyük
                </button>
              </div>
            </div>

            {/* Bildirim Ayarları */}
            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <FaBell className="text-2xl text-blue-500" />
                <span className="text-lg font-medium">Bildirim Ayarları</span>
              </div>
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Düzenle
              </button>
            </div>

            {/* Güvenlik Ayarları */}
            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <FaLock className="text-2xl text-blue-500" />
                <span className="text-lg font-medium">Güvenlik Ayarları</span>
              </div>
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Düzenle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;