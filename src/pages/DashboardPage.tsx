import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Book, Target, Clock, TrendingUp} from 'lucide-react';
import WeeklyProgressChart from '../components/WeeklyProgressChart';
import UserStatsGraphs from '../components/UserStatsGraphs';
import api from '../api/api';

/**
 * @interface WeeklyProgressData
 * @desc     Haftalık ilerleme verilerinin tip tanımlaması
 * 
 * @property {number[]} weeklyProgress - Haftalık ilerleme yüzdelerini içeren dizi
 * @property {string[]} labels - İlerleme verilerine karşılık gelen tarih etiketleri
 */
interface WeeklyProgressData {
  weeklyProgress: number[];
  labels: string[];
}

/**
 * @component DashboardPage
 * @desc     Kullanıcı gösterge paneli ana bileşeni
 * @returns  {JSX.Element} Dashboard yapısı
 * 
 * @states
 * - weeklyData: Haftalık ilerleme verileri
 * - loading: Veri yükleme durumu
 * - error: Hata durumu
 * 
 * @sections
 * - Stats Cards: Özet istatistik kartları
 * - Weekly Progress: Haftalık ilerleme grafiği
 * - User Stats: Detaylı kullanıcı istatistikleri
 * 
 * @styles
 * - bg-gray-900/bg-gray-100: Tema bazlı arka plan rengi
 * - text-white/text-gray-800: Tema bazlı metin rengi
 */
const DashboardPage: React.FC = () => {
  const { theme } = useTheme();
  
  /**
   * @state weeklyData
   * @desc  Haftalık ilerleme verilerini tutan state
   * @type  {WeeklyProgressData}
   */
  const [weeklyData, setWeeklyData] = useState<WeeklyProgressData>({
    weeklyProgress: [],
    labels: []
  });
  
  /**
   * @state loading
   * @desc  Veri yükleme durumunu kontrol eden state
   * @type  {boolean}
   */
  const [loading, setLoading] = useState(true);
  
  /**
   * @state error
   * @desc  Hata durumunu tutan state
   * @type  {string | null}
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * @function fetchWeeklyProgress
   * @desc     Haftalık ilerleme verilerini API'den çeken asenkron fonksiyon
   * @async
   * @returns  {Promise<void>}
   */
  const fetchWeeklyProgress = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/weekly-progress');
      setWeeklyData(response.data);
      setError(null);
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu');
      console.error('Haftalık ilerleme verileri alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * @effect
   * @desc   Sayfa yüklendiğinde verileri çeken effect hook
   */
  useEffect(() => {
    fetchWeeklyProgress();
  }, []);

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Çalışma Süresi Kartı */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Toplam Çalışma Süresi</p>
                <h3 className="text-2xl font-bold mt-1">24 Saat</h3>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          {/* Soru Sayısı Kartı */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Çözülen Soru Sayısı</p>
                <h3 className="text-2xl font-bold mt-1">150</h3>
              </div>
              <Book className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          {/* Başarı Oranı Kartı */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Başarı Oranı</p>
                <h3 className="text-2xl font-bold mt-1">%85</h3>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Weekly Progress Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} mb-8`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Haftalık İlerleme
            </h2>
            <TrendingUp className="w-6 h-6 text-gray-400" />
          </div>
          <div className="h-64">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <WeeklyProgressChart 
                data={weeklyData.weeklyProgress} 
                labels={weeklyData.labels}
              />
            )}
          </div>
        </motion.div>

        {/* User Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <UserStatsGraphs />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
