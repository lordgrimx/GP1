import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, Calendar } from 'lucide-react';
import { getUserProfile } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

interface UserData {
  username: string;
  email: string;
  // Add more user-specific fields as needed
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
        const intelligenceData = JSON.parse(response.data.typeofintelligence);
      } catch (err) {
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {userData?.username}!</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <DashboardCard
          title="Performance Overview"
          icon={<BarChart size={24} />}
          content="View your overall performance across all subjects."
        />
        <DashboardCard
          title="Subject Breakdown"
          icon={<PieChart size={24} />}
          content="See your progress in individual subjects."
        />
        <DashboardCard
          title="Study Schedule"
          icon={<Calendar size={24} />}
          content="Check your upcoming study sessions and exams."
        />
      </div>
      {/* Add more user-specific data and components here */}
    </div>
  );
};

const DashboardCard: React.FC<{ title: string; icon: React.ReactNode; content: string }> = ({ title, icon, content }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center mb-4">
      <div className="text-blue-600 mr-3">{icon}</div>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <p className="text-gray-600">{content}</p>
  </div>
);

export default DashboardPage;