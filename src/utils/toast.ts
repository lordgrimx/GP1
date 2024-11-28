import toast, { ToastPosition } from 'react-hot-toast';

/**
 * @interface ToastOptions
 * @desc    Toast seçenekleri için tip tanımlaması
 */
interface ToastOptions {
  position?: ToastPosition;
  duration?: number;
  className?: string;
}

/**
 * @constant defaultOptions
 * @desc    Varsayılan toast seçenekleri
 */
const defaultOptions: ToastOptions = {
  position: 'top-right',
  duration: 3000,
};

/**
 * @constant showToast
 * @desc    Modern toast bildirimleri için yardımcı fonksiyonlar
 */
export const showToast = {
  /**
   * @function success
   * @desc     Başarı bildirimi gösterir
   * @param    {string} message - Gösterilecek mesaj
   * @param    {ToastOptions} options - Özelleştirme seçenekleri
   */
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      ...defaultOptions,
      ...options,
      style: {
        background: '#10B981',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
    });
  },

  /**
   * @function error
   * @desc     Hata bildirimi gösterir
   * @param    {string} message - Gösterilecek mesaj
   * @param    {ToastOptions} options - Özelleştirme seçenekleri
   */
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      ...defaultOptions,
      ...options,
      style: {
        background: '#EF4444',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.1), 0 2px 4px -1px rgba(239, 68, 68, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#EF4444',
      },
    });
  },

  /**
   * @function warning
   * @desc     Uyarı bildirimi gösterir
   * @param    {string} message - Gösterilecek mesaj
   * @param    {ToastOptions} options - Özelleştirme seçenekleri
   */
  warning: (message: string, options?: ToastOptions) => {
    toast(message, {
      ...defaultOptions,
      ...options,
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.1), 0 2px 4px -1px rgba(245, 158, 11, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
      },
    });
  },

  /**
   * @function info
   * @desc     Bilgi bildirimi gösterir
   * @param    {string} message - Gösterilecek mesaj
   * @param    {ToastOptions} options - Özelleştirme seçenekleri
   */
  info: (message: string, options?: ToastOptions) => {
    toast(message, {
      ...defaultOptions,
      ...options,
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
      },
    });
  },

  /**
   * @function custom
   * @desc     Özel bildirim gösterir
   * @param    {string} message - Gösterilecek mesaj
   * @param    {ToastOptions & { icon?: string | JSX.Element, backgroundColor?: string }} options - Özelleştirme seçenekleri
   */
  custom: (message: string, options?: ToastOptions & { icon?: string | JSX.Element, backgroundColor?: string }) => {
    toast(message, {
      ...defaultOptions,
      ...options,
      icon: options?.icon,
      style: {
        background: options?.backgroundColor || '#fff',
        color: options?.backgroundColor ? '#fff' : '#1F2937',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(8px)',
      },
    });
  },
};

/**
 * @example Kullanım örnekleri
 * 
 * // Basit kullanım
 * showToast.success('İşlem başarılı!');
 * 
 * // Pozisyon belirterek
 * showToast.error('Bir hata oluştu!', { position: 'bottom-center' });
 * 
 * // Süre belirterek
 * showToast.warning('Dikkat!', { duration: 5000 });
 * 
 * // Özel toast
 * showToast.custom('Özel mesaj!', {
 *   icon: '🚀',
 *   backgroundColor: '#6366F1',
 *   position: 'top-center'
 * });
 */

export default showToast;