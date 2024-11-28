/**
 * @file    LoadingSpinner.tsx
 * @desc    Yükleme animasyonu bileşeni
 * @details Sayfa veya içerik yüklenirken gösterilen dönen animasyon
 */

import React from 'react';

/**
 * @component LoadingSpinner
 * @desc     Yükleme durumunu gösteren dönen animasyon bileşeni
 * @returns  {JSX.Element} Merkezi konumlandırılmış spinner animasyonu
 * 
 * @styles
 * - flex: Flexbox düzeni
 * - justify-center: Yatayda ortalama
 * - items-center: Dikeyde ortalama
 * - animate-spin: Dönme animasyonu
 * - rounded-full: Tam yuvarlak şekil
 * - h-12: 48px yükseklik
 * - w-12: 48px genişlik
 * - border-b-2: Alt kenarda 2px kalınlığında çizgi
 * - border-blue-600: Mavi renkli çizgi
 */
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export default LoadingSpinner;