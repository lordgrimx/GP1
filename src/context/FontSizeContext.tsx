/**
 * @file    FontSizeContext.tsx
 * @desc    Font boyutu yönetimi için context
 * @details Uygulama genelinde font boyutu değişimini yöneten context yapısı
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * @type     FontSize
 * @desc     Font boyutu seçenekleri için tip tanımı
 * @values   'small' | 'medium' | 'large'
 */
type FontSize = 'small' | 'medium' | 'large';

/**
 * @interface FontSizeContextType
 * @desc     Context veri yapısı
 * @property {FontSize} fontSize - Aktif font boyutu
 * @property {Function} setFontSize - Font boyutu değiştirme fonksiyonu
 */
interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

/**
 * @context  FontSizeContext
 * @desc     Font boyutu context oluşturma
 * @default  undefined
 */
const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

/**
 * @component FontSizeProvider
 * @desc     Font boyutu context sağlayıcısı
 * @param    {React.ReactNode} children - Alt bileşenler
 */
export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  /**
   * @effect  Font boyutu değişimi
   * @desc    Font boyutu değiştiğinde CSS class'ını günceller
   */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-small', 'text-medium', 'text-large');
    root.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

/**
 * @hook     useFontSize
 * @desc     Font boyutu context hook'u
 * @returns  {FontSizeContextType} Font boyutu context değerleri
 * @throws   {Error} Context dışında kullanılırsa hata fırlatır
 */
export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};