import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { getUserIntelligence, getTestTracks } from '../api/api';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface SubjectStats {
  correct: number;
  incorrect: number;
  empty: number;
}

interface TestTrackData {
  examName: string;
  examType: string;
  subjects: {
    [key: string]: SubjectStats;
  };
  createdAt: string;
}

interface IntelligenceData {
  [key: string]: number;
}

const UserStatsGraphs = () => {
  const [intelligenceData, setIntelligenceData] = useState<IntelligenceData | null>(null);
  const [testTrackData, setTestTrackData] = useState<TestTrackData[]>([]);
  const { theme } = useTheme();

  const textColor = theme === 'dark' ? '#fff' : '#000';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [intelligenceResponse, testTracksResponse] = await Promise.all([
          getUserIntelligence(),
          getTestTracks()
        ]);
        
        setIntelligenceData(intelligenceResponse.data);
        setTestTrackData(testTracksResponse.data);
      } catch (error) {
        console.error('Veri çekerken hata:', error);
      }
    };

    fetchData();
  }, []);

  const intelligenceChartData = {
    labels: intelligenceData ? Object.keys(intelligenceData) : [],
    datasets: [
      {
        data: intelligenceData ? Object.values(intelligenceData) : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const testTrackChartData = {
    labels: testTrackData.map(track => track.examName),
    datasets: [
      {
        label: 'Doğru',
        data: testTrackData.map(track => 
          Object.values(track.subjects).reduce((acc: number, curr: any) => acc + curr.correct, 0)
        ),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Yanlış',
        data: testTrackData.map(track => 
          Object.values(track.subjects).reduce((acc: number, curr: any) => acc + curr.incorrect, 0)
        ),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
      {
        label: 'Boş',
        data: testTrackData.map(track => 
          Object.values(track.subjects).reduce((acc: number, curr: any) => acc + curr.empty, 0)
        ),
        borderColor: 'rgb(201, 203, 207)',
        tension: 0.1,
      }
    ],
  };

  const netScoreChartData = {
    labels: testTrackData.map(track => track.examName),
    datasets: [{
      label: 'Net Sayısı',
      data: testTrackData.map(track => {
        const totalCorrect = Object.values(track.subjects)
          .reduce((sum: number, subject: SubjectStats) => sum + subject.correct, 0);
        const totalIncorrect = Object.values(track.subjects)
          .reduce((sum: number, subject: SubjectStats) => sum + subject.incorrect, 0);
        return totalCorrect - (totalIncorrect * 0.25);
      }),
      borderColor: theme === 'dark' ? '#60A5FA' : '#2563EB',
      backgroundColor: theme === 'dark' ? '#60A5FA' : '#2563EB',
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: gridColor
        },
        ticks: {
          color: textColor
        }
      },
      x: {
        grid: {
          color: gridColor
        },
        ticks: {
          color: textColor
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-2">
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className="text-lg font-bold mb-2">Deneme Sonuçları Gelişimi</h3>
        <div className="h-64 w-full">
          {testTrackData.length > 0 && <Line data={testTrackChartData} options={options} />}
        </div>
      </div>

      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className="text-lg font-bold mb-2">Net Sayısı Gelişimi</h3>
        <div className="h-64 w-full">
          {testTrackData.length > 0 && <Line data={netScoreChartData} options={options} />}
        </div>
      </div>

      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className="text-lg font-bold mb-2">Zeka Türü Dağılımı</h3>
        <div className="h-64 w-full">
          {intelligenceData && <Pie data={intelligenceChartData} />}
        </div>
      </div>
    </div>
  );
};

export default UserStatsGraphs;