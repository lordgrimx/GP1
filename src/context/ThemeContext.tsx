/**
 * @file    ThemeContext.tsx
 * @desc    Tema yönetimi için context
 * @details Uygulama genelinde karanlık/aydınlık tema değişimini yöneten context yapısı
 */

import React, { createContext, useContext, useState } from 'react';

/**
 * @type     Theme
 * @desc     Tema seçenekleri için tip tanımı
 * @values   'light' | 'dark'
 */
export type Theme = 'light' | 'dark';

/**
 * @interface ThemeContextType
 * @desc     Tema context tipi
 * @property {string} theme - Aktif tema ('light' | 'dark')
 * @property {() => void} toggleTheme - Tema değiştirme fonksiyonu
 */
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

/**
 * @context  ThemeContext
 * @desc     Tema yönetimi için context
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * @provider ThemeProvider
 * @desc     Tema context sağlayıcısı
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as 'light' | 'dark') || 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * @hook     useTheme
 * @desc     Tema context hook'u
 * @returns  {ThemeContextType} Tema context değerleri
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};