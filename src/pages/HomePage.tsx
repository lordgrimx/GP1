/**
 * @file    HomePage.tsx
 * @desc    Ana sayfa bileşeni
 * @details Uygulamanın karşılama sayfası, özellik tanıtımları ve istatistiklerin gösterildiği landing page
 */

import React, {  useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Users, Brain, Target, Clock, Book } from 'lucide-react';
import { motion } from 'framer-motion';
import CameraButton from '../components/CameraButton';
import { useTheme } from '../context/ThemeContext';
import FeatureCard from '../components/FeatureCard';
import PomodoroModal from '../components/PomodoroModal';

/**
 * @component HomePage
 * @desc     Ana sayfa bileşeni, kullanıcıları karşılayan ve uygulamanın özelliklerini tanıtan sayfa
 * @returns  {JSX.Element} Landing page yapısı
 * 
 * @states
 * - isPomodoroOpen: Pomodoro modalının açık/kapalı durumu
 * 
 * @animations
 * - containerVariants: Özellikler bölümü için kapsayıcı animasyon ayarları
 * - itemVariants: Her bir özellik kartı için animasyon ayarları
 * 
 * @sections
 * - Hero: Karşılama bölümü ve çağrı butonu
 * - Features: Özellikler ve açıklamaları
 * - Stats: İstatistik kartları
 * 
 * @styles
 * - min-h-screen: Tam ekran yükseklik
 * - bg-gray-900/bg-gray-50: Tema bazlı arka plan rengi
 * - text-white/text-gray-800: Tema bazlı metin rengi
 */
const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const isAuthenticated = !!localStorage.getItem('token');
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);

  /**
   * @constant containerVariants
   * @desc    Özellikler bölümü için kapsayıcı animasyon konfigürasyonu
   * @type    {Object}
   * 
   * @property {Object} hidden - Başlangıç durumu
   * @property {Object} visible - Görünür durum ve geçiş ayarları
   */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  /**
   * @constant itemVariants
   * @desc    Her bir özellik kartı için animasyon konfigürasyonu
   * @type    {Object}
   * 
   * @property {Object} hidden - Başlangıç durumu (yukarıdan aşağı hareket)
   * @property {Object} visible - Son durum (normal pozisyon)
   */
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const features = [
    {
      title: "Akıllı Öğrenme Sistemi",
      description: "Yapay zeka destekli öğrenme sistemi ile kişiselleştirilmiş çalışma programı",
      icon: Brain,
      onClick: () => console.log("Akıllı Öğrenme tıklandı")
    },
    {
      title: "Hedef Odaklı",
      description: "Hedeflerinize uygun çalışma stratejileri ve başarı takibi",
      icon: Target,
      onClick: () => console.log("Hedef Odaklı tıklandı")
    },
    {
      title: "Zaman Yönetimi",
      description: "Verimli çalışma planları ve zaman yönetimi araçları",
      icon: Clock,
      onClick: () => setShowPomodoro(true)
    },
    {
      title: "Konu Özetleri",
      description: "Tüm YKS konularına ait özet ve püf noktaları",
      icon: Book,
      onClick: () => console.log("Konu Özetleri tıklandı")
    },
    {
      title: "Performans Analizi",
      description: "Detaylı istatistikler ve gelişim grafikleri",
      icon: BarChart2,
      onClick: () => console.log("Performans Analizi tıklandı")
    },
    {
      title: "Kişiselleştirilmiş",
      description: "Size özel öneriler ve çalışma teknikleri",
      icon: Users,
      onClick: () => console.log("Kişiselleştirilmiş tıklandı")
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`relative overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h1 className={`text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <span className="block">YKS Hazırlığında</span>
                  <span className="block text-blue-600">Yeni Nesil Asistan</span>
                </h1>
                <p className={`mt-3 text-base sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                  Yapay zeka destekli öğrenme asistanı ile YKS hazırlığınızı en verimli şekilde planlayın, 
                  takip edin ve başarıya ulaşın.
                </p>
                {!isAuthenticated && (
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                        Hemen Başla
                      </Link>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </main>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-12 bg-gradient-to-b from-transparent to-blue-50 dark:to-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2 
              variants={itemVariants}
              className={`text-3xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              Neden YKS Assistant?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className={`mt-4 max-w-2xl text-xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}
            >
              Size özel hazırlanmış özelliklerle YKS yolculuğunuzda yanınızdayız
            </motion.p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div variants={itemVariants} key={index}>
                  <FeatureCard
                    icon={<feature.icon className="w-6 h-6 text-blue-500" />}
                    title={feature.title}
                    description={feature.description}
                    onClick={feature.onClick}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>10K+</p>
              <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Aktif Kullanıcı</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>50K+</p>
              <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Çözülen Soru</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>1000+</p>
              <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Konu Özeti</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>95%</p>
              <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Memnuniyet</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Authenticated User Tools */}
      {isAuthenticated && (
        <div className="fixed bottom-8 right-8 z-50">
          <CameraButton 
            apiKey={import.meta.env.VITE_API_KEY}
            model="gemini-1.5-flash-latest"
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
          />
        </div>
      )}

      {/* Pomodoro Modal */}
      <PomodoroModal
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
      />

      {/* Pomodoro Modal */}
      {showPomodoro && (
        <PomodoroModal 
          isOpen={showPomodoro} 
          onClose={() => setShowPomodoro(false)}
        />
      )}
    </div>
  );
};

export default HomePage;