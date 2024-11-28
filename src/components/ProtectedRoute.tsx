/**
 * @file    ProtectedRoute.tsx
 * @desc    Korumalı rota bileşeni
 * @details Kullanıcı girişi gerektiren rotaları ve bileşenleri kontrol eden wrapper bileşen
 */

import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * @interface ProtectedRouteProps
 * @desc     Bileşen props tanımları
 * @property {ReactNode} children - Korunacak içerik
 * @property {boolean} [requireAuth=true] - Yetkilendirme gerekli mi?
 */
interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

/**
 * @component ProtectedRoute
 * @desc     Rota koruma bileşeni
 * @param    {ProtectedRouteProps} props - Bileşen props'ları
 */
const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token') !== null;

  // Eğer yetkilendirme gerekli değilse direkt içeriği göster
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Yetkilendirme gerekli ve kullanıcı giriş yapmamışsa login'e yönlendir
  if (!isAuthenticated) {
    // Sadece korumalı rotalar için yönlendirme yap
    if (location.pathname !== '/' && 
        location.pathname !== '/login' && 
        location.pathname !== '/register') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // Kullanıcı giriş yapmışsa içeriği göster
  return <>{children}</>;
};

export default ProtectedRoute;