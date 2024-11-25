import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getUserProfile, getUserIntelligence } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

Chart.register(...registerables);

interface UserData {
  username: string;
  email: string;
  typeofintelligence?: { [key: string]: number };
}

const DashboardPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserProfile();
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  if (!userData?.typeofintelligence || Object.keys(userData?.typeofintelligence).length === 0) {
    return <p>Veriler yükleniyor...</p>;
  }

  const intelligenceTypes = Object.keys(userData?.typeofintelligence || {});
  const intelligenceValues = Object.values(userData?.typeofintelligence || {});

  const colors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(199, 199, 199, 0.6)',
    'rgba(83, 102, 255, 0.6)',
  ];

  const borderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(199, 199, 199, 1)',
    'rgba(83, 102, 255, 1)',
  ];

  const data = {
    labels: intelligenceTypes,
    datasets: [
      {
        label: 'Zeka Türleri Yüzde Değerleri',
        data: intelligenceValues,
        backgroundColor: colors.slice(0, intelligenceTypes.length),
        borderColor: borderColors.slice(0, intelligenceTypes.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {userData?.username}!</h1>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Zeka Türleri Yüzde Değerleri</h2>
        <div className="flex">
          {/* Sol tarafa grafiği yerleştirme */}
          <div className="w-1/3"> {/* Sol kısım genişliği %33 */}
            <div style={{ width: '100%', height: '300px' }}>
              <Bar key={JSON.stringify(userData?.typeofintelligence)} data={data} options={options} />
            </div>
          </div>
          {/* Sağ tarafı boş bırakabilir veya başka içerik ekleyebilirsiniz */}
          <div className="w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
