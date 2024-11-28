/**
 * @file    PomodoroModal.tsx
 * @desc    Pomodoro zamanlayıcı modal bileşeni
 * @details Pomodoro tekniği için zamanlayıcı ve tur takibi yapan modal
 */

import { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import showToast from '../utils/toast';

/**
 * @interface PomodoroModalProps
 * @desc     Modal props tanımları
 * @property {boolean} isOpen - Modalın görünürlük durumu
 * @property {Function} onClose - Modal kapatma fonksiyonu
 */
interface PomodoroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * @component PomodoroModal
 * @desc     Pomodoro zamanlayıcı modal bileşeni
 * @param    {PomodoroModalProps} props - Bileşen props'ları
 */
const PomodoroModal: React.FC<PomodoroModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();

  /**
   * @state   Zamanlayıcı state'leri
   * @desc    Pomodoro durumlarını yöneten state'ler
   */
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 dakika
  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState<'work' | 'break'>('work');

  /**
   * @effect  Zamanlayıcı
   * @desc    Aktif durumdayken zamanı geri sayar
   */
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  /**
   * @function handleTimerComplete
   * @desc     Zamanın bittiğinde çalışma ve mola arasında geçiş yapılır
   */
  const handleTimerComplete = () => {
    setIsRunning(false);
    if (currentMode === 'work') {
      showToast.success('Çalışma süresi bitti! Mola zamanı.');
      setCurrentMode('break');
      setTimeLeft(5 * 60); // 5 dakika mola
    } else {
      showToast.success('Mola bitti! Çalışma zamanı.');
      setCurrentMode('work');
      setTimeLeft(25 * 60);
    }
  };

  /**
   * @function formatTime
   * @desc     Zamanı dakika ve saniye formatına dönüştürür
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * @function handleReset
   * @desc     Zamanı sıfırlar ve çalışma ve mola arasında geçiş yapılır
   */
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(currentMode === 'work' ? 25 * 60 : 5 * 60);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`
        w-full max-w-md p-6 rounded-lg shadow-xl
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
      `}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {currentMode === 'work' ? 'Çalışma Zamanı' : 'Mola Zamanı'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold mb-4">
            {formatTime(timeLeft)}
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`
                p-3 rounded-full
                ${isRunning 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
                }
                text-white
              `}
            >
              {isRunning ? <Pause /> : <Play />}
            </button>
            <button
              onClick={handleReset}
              className="p-3 rounded-full bg-gray-500 hover:bg-gray-600 text-white"
            >
              <RotateCcw />
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => {
              setCurrentMode('work');
              setTimeLeft(25 * 60);
              setIsRunning(false);
            }}
            className={`
              px-4 py-2 rounded
              ${currentMode === 'work' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700'
              }
            `}
          >
            Çalışma
          </button>
          <button
            onClick={() => {
              setCurrentMode('break');
              setTimeLeft(5 * 60);
              setIsRunning(false);
            }}
            className={`
              px-4 py-2 rounded
              ${currentMode === 'break' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700'
              }
            `}
          >
            Mola
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroModal; 