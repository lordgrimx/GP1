/**
 * @file    main.tsx
 * @desc    Uygulama giriş noktası
 * @details React uygulamasının başlatıldığı ve kök bileşenin render edildiği dosya
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * @constant rootElement
 * @desc    Uygulamanın mount edileceği DOM elementi
 * @throws  {Error} 'root' ID'li element bulunamazsa
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Uygulama başlatılamadı: "root" ID\'li element bulunamadı.'
  );
}

/**
 * @function createRoot
 * @desc    React 18 ile gelen yeni root oluşturma API'si
 * @param   {HTMLElement} rootElement - Kök DOM elementi
 */
createRoot(rootElement).render(
  /**
   * @component StrictMode
   * @desc     React'in geliştirme modunda ek kontroller yapmasını sağlar
   * @benefits
   * - Güvensiz yaşam döngülerinin tespiti
   * - Eski string ref API'lerinin uyarısı
   * - Beklenmeyen yan etkilerin tespiti
   * - React.findDOMNode kullanımının tespiti
   * - Yeniden kullanılabilir state tespiti
   */
  <StrictMode>
    <App />
  </StrictMode>
);
