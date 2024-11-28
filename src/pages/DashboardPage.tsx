import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Book, Target, Clock, TrendingUp, Calendar, BarChart2 } from 'lucide-react';
import WeeklyProgressChart from '../components/WeeklyProgressChart';
import UserStatsGraphs from '../components/UserStatsGraphs';
import api from '../api/api';

interface WeeklyProgressData {
  weeklyProgress: number[];
  labels: string[];
}

const DashboardPage: React.FC = () => {
  const { theme } = useTheme();
  const [weeklyData, setWeeklyData] = useState<WeeklyProgressData>({
    weeklyProgress: [],
    labels: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchWeeklyProgress();
  }, []);

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

        {/* Haftalık İlerleme Grafiği */}
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

        {/* Diğer İstatistik Grafikleri */}
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
