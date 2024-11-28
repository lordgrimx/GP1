import React from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';

/**
 * Haftalık ilerleme grafiği için prop tipleri tanımlaması
 * @interface WeeklyProgressChartProps
 * @property {number[]} data - Grafik için gösterilecek ilerleme verileri dizisi
 * @property {string[]} labels - Grafik ekseni için etiket dizisi
 */
interface WeeklyProgressChartProps {
  data: number[];
  labels: string[];
}

/**
 * Haftalık ilerleme durumunu gösteren çizgi grafik bileşeni
 * @component
 * @param {WeeklyProgressChartProps} props - Bileşen props'ları
 * @param {number[]} props.data - İlerleme yüzdeleri dizisi
 * @param {string[]} props.labels - Grafik etiketleri dizisi
 * @returns {JSX.Element} Line chart bileşeni
 */
const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ data, labels }) => {
  const { theme } = useTheme();
  
  /**
   * Chart.js için veri konfigürasyonu
   * @constant
   * @type {Object}
   */
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Günlük İlerleme',
        data: data,
        fill: true,
        borderColor: theme === 'dark' ? '#60A5FA' : '#2563EB',
        backgroundColor: theme === 'dark' 
          ? 'rgba(96, 165, 250, 0.1)' 
          : 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
      },
    ],
  };

  /**
   * Chart.js için görünüm ve davranış ayarları
   * @constant
   * @type {Object}
   */
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000',
        },
      },
      x: {
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          /**
           * Tooltip içeriğini özelleştiren callback fonksiyonu
           * @param {Object} context - Chart.js tooltip context objesi
           * @returns {string} Formatlanmış tooltip metni
           */
          label: function(context: any) {
            return `İlerleme: ${context.parsed.y}%`;
          }
        }
      }
    },
  };

  return <Line data={chartData} options={options} />;
};

export default WeeklyProgressChart; 