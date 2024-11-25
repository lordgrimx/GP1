import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getUserProfile, getUserIntelligence, getTestTracks } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

Chart.register(...registerables);

interface UserData {
  username: string;
  email: string;
  typeofintelligence?: { [key: string]: number };
}

interface TestTrackData {
  examName: string;
  examType: string;
  subjects: {
    [key: string]: {
      correct: number;
      incorrect: number;
      empty: number;
    };
  };
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [testTracks, setTestTracks] = useState<TestTrackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserIntelligence = async () => {
      try {
        const response = await getUserIntelligence();
        setUserData((prevData) => ({
          ...prevData,
          typeofintelligence: response.data,
        }));
      } catch (err) {
        console.error('Failed to load user intelligence:', err);
      }
    };

    fetchUserIntelligence();
  }, []);

  useEffect(() => {
    const fetchTestTracks = async () => {
      if (userData?.typeofintelligence) {
        try {
          const response = await getTestTracks();
          setTestTracks(response.data);
          setLoading(false);
        } catch (err) {
          setError('Failed to load test track data');
          setLoading(false);
        }
      }
    };

    fetchTestTracks();
  }, [userData?.typeofintelligence]);

  const calculateNetScore = (subjects: TestTrackData['subjects']) => {
    let totalCorrect = 0;
    let totalIncorrect = 0;

    Object.values(subjects).forEach(({ correct, incorrect }) => {
      totalCorrect += correct;
      totalIncorrect += incorrect;
    });

    return totalCorrect - (totalIncorrect * 0.25); // YKS scoring rule
  };

  const chartData = {
    labels: testTracks
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map(track => new Date(track.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Net Score',
        data: testTracks
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map(track => calculateNetScore(track.subjects)),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Deneme Sınavı Performansı',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Net Skor',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Tarih',
        },
      },
    },
  };

  if (loading && !userData?.typeofintelligence) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Intelligence Type Chart */}
        {userData?.typeofintelligence && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Zeka Türü Dağılımı</h2>
            <div className="h-[300px]">
              <Bar
                data={{
                  labels: Object.keys(userData.typeofintelligence),
                  datasets: [{
                    data: Object.values(userData.typeofintelligence),
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.5)',
                      'rgba(54, 162, 235, 0.5)',
                      'rgba(255, 206, 86, 0.5)',
                      'rgba(75, 192, 192, 0.5)',
                      'rgba(153, 102, 255, 0.5)',
                    ],
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Test Performance Chart - Only show after intelligence data is loaded */}
        {userData?.typeofintelligence && testTracks.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Deneme Sınavı Performansı</h2>
            <div className="h-[300px]">
              <Line 
                data={chartData} 
                options={{
                  ...chartOptions,
                  maintainAspectRatio: true,
                  responsive: true,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
