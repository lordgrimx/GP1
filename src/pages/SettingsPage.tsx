/**
 * @file    SettingsPage.tsx
 * @desc    Uygulama ayarları sayfası
 * @details Kullanıcının tema, yazı boyutu, bildirim ve güvenlik ayarlarını yönetebileceği sayfa
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun, FaBell, FaLock } from 'react-icons/fa';
import { useFontSize } from '../context/FontSizeContext';
import { FaFont } from 'react-icons/fa';

/**
 * @type FontSize
 * @desc Yazı boyutu seçenekleri için tip tanımlaması
 */
type FontSize = 'small' | 'medium' | 'large';

/**
 * @component SettingsPage
 * @desc     Kullanıcı ayarları yönetim sayfası
 * @returns  {JSX.Element} Ayarlar sayfası yapısı
 * 
 * @contexts
 * - ThemeContext: Tema ayarları için context
 * - FontSizeContext: Yazı boyutu ayarları için context
 * 
 * @sections
 * - Theme Settings: Tema modu seçimi
 * - Font Size Settings: Yazı boyutu ayarları
 * - Notification Settings: Bildirim tercihleri
 * - Security Settings: Güvenlik ayarları
 */
const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

  /**
   * @constant fontSizes
   * @desc    Kullanılabilir yazı boyutu seçenekleri
   */
  const fontSizes: FontSize[] = ['small', 'medium', 'large'];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-8 dark:text-white">Ayarlar</h1>
          
          <div className="space-y-6">
            {/* Tema Ayarı Kartı */}
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

            {/* Yazı Boyutu Ayarı Kartı */}
            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <FaFont className="text-2xl text-blue-500" />
                <span className="text-lg font-medium">Yazı Boyutu</span>
              </div>
              <div className="flex space-x-2">
                {fontSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      fontSize === size
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {size === 'small' ? 'Küçük' : size === 'medium' ? 'Orta' : 'Büyük'}
                  </button>
                ))}
              </div>
            </div>

            {/* Bildirim Ayarları Kartı */}
            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <FaBell className="text-2xl text-blue-500" />
                <span className="text-lg font-medium">Bildirim Ayarları</span>
              </div>
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Düzenle
              </button>
            </div>

            {/* Güvenlik Ayarları Kartı */}
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