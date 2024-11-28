/**
 * @file    FeatureCard.tsx
 * @desc    Özellik kartı bileşeni
 * @details Uygulama özelliklerini görsel ve açıklama ile gösteren kart bileşeni
 */

import { ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * @interface FeatureCardProps
 * @desc     Özellik kartı bileşeni için prop tipleri
 */
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

/**
 * @component FeatureCard
 * @desc     Özellik kartı bileşeni
 * @param    {FeatureCardProps} props - Bileşen props'ları
 * @returns  {JSX.Element} Animasyonlu ve duyarlı özellik kartı
 * 
 * @styles
 * - motion.div: Hover animasyonu için Framer Motion kullanımı
 * - p-6: İç boşluk (padding)
 * - rounded-xl: Yuvarlak köşeler
 * - shadow-lg: Gölge efekti
 * - transition-all: Tüm stil değişimleri için geçiş efekti
 * - duration-300: Geçiş süresi (300ms)
 * 
 * @theming
 * - dark:bg-gray-800: Koyu tema arka plan rengi
 * - dark:hover:bg-gray-700: Koyu tema hover arka plan rengi
 * - bg-white: Açık tema arka plan rengi
 * - hover:bg-gray-50: Açık tema hover arka plan rengi
 */
const FeatureCard = ({ icon, title, description, onClick }: FeatureCardProps) => {
  const { theme } = useTheme();

  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer p-6 rounded-lg shadow-lg
        transition-all duration-300 transform hover:scale-105
        ${theme === 'dark' 
          ? 'bg-gray-800 hover:bg-gray-700' 
          : 'bg-white hover:bg-gray-50'
        }
      `}
    >
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className={`
        mt-2 
        ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
      `}>
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;