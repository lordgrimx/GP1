import React from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <div style={styles.toast}>
      <span>{message}</span>
      <button style={styles.closeButton} onClick={onClose}>
        ×
      </button>
    </div>
  );
};

const styles = {
  toast: {
    position: 'fixed' as 'fixed',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    zIndex: 1000,
    fontSize: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '400px',
    width: '90%',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
  },
};

export default Toast;
