import React from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';

interface WeeklyProgressChartProps {
  data: number[];
  labels: string[];
}

const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ data, labels }) => {
  const { theme } = useTheme();
  
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