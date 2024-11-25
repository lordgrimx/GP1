import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        background: '#10B981',
        color: '#fff',
        padding: '16px',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
      duration: 3000,
    });
  },

  error: (message: string) => {
    toast.error(message, {
      style: {
        background: '#EF4444',
        color: '#fff',
        padding: '16px',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#EF4444',
      },
      duration: 3000,
    });
  },

  warning: (message: string) => {
    toast(message, {
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: '#fff',
        padding: '16px',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '500',
      },
      duration: 3000,
    });
  },

  info: (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#fff',
        padding: '16px',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '500',
      },
      duration: 3000,
    });
  },
}; 