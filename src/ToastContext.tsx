import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast from './components/toast'; // Toast bileşenini içe aktarın

interface ToastContextProps {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null); // 3 saniye sonra mesajı otomatik kapatır
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
