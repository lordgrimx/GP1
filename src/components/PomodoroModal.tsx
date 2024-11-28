import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

interface PomodoroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PomodoroModal: React.FC<PomodoroModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [time, setTime] = useState(25 * 60); // 25 dakika
  const [isActive, setIsActive] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 4;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime === 0) {
            handleRoundComplete();
          }
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const handleStart = () => {
    setIsActive(true);
    toast.success(
      `Pomodoro Başladı - Tur ${currentRound}/${totalRounds}`,
      {
        duration: time * 1000,
        position: 'top-left',
        icon: '⏱️',
      }
    );
  };

  const handleStop = () => {
    setIsActive(false);
    toast.dismiss();
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(25 * 60);
    setCurrentRound(1);
    toast.dismiss();
  };

  const handleRoundComplete = () => {
    if (currentRound < totalRounds) {
      setCurrentRound(prev => prev + 1);
      setTime(25 * 60);
      toast.success(`${currentRound}. tur tamamlandı! Yeni tur başlıyor.`, {
        duration: 3000,
        position: 'top-left',
      });
    } else {
      setIsActive(false);
      setCurrentRound(1);
      setTime(25 * 60);
      toast.success('Tüm pomodoro turları tamamlandı!', {
        duration: 5000,
        position: 'top-left',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl w-96`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Pomodoro Zamanlayıcı</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="text-center my-8">
          <div className="text-4xl font-bold mb-4">
            {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
          </div>
          <div className="mb-4">
            Tur: {currentRound}/{totalRounds}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Başlat
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Durdur
            </button>
          )}
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroModal; 