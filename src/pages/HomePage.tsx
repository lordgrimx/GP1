import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BarChart2, Users } from 'lucide-react';
import CameraButton from '../components/CameraButton'; 


const HomePage: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  // Debug için environment variables'ı kontrol et
  useEffect(() => {
    console.log("Environment check:", {
      apiKey: import.meta.env.VITE_API_KEY,
      allEnv: import.meta.env
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to YKS Assistant</h1>
      <p className="text-xl text-center mb-12">Your ultimate companion for YKS exam preparation</p>
      
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<BookOpen size={48} />}
          title="Subject Summaries"
          description="Access concise summaries for all YKS subjects to streamline your study process."
        />
        <FeatureCard
          icon={<BarChart2 size={48} />}
          title="Performance Tracking"
          description="Monitor your progress with detailed analytics and performance dashboards."
        />
        <FeatureCard
          icon={<Users size={48} />}
          title="Personalized Experience"
          description="Get a tailored study plan based on your strengths and areas for improvement."
        />
      </div>
      
      <div className="text-center mt-12">
        {!isAuthenticated && (
          <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
            Get Started
          </Link>
        )}
      </div>

      {isAuthenticated && (
        <div className="fixed bottom-8 right-8 z-50">
          {'AIzaSyDGdC1u1H0bJa4mtJHgOaJGSSKZzw8RRA0' ? (
            <CameraButton 
              apiKey={'AIzaSyDGdC1u1H0bJa4mtJHgOaJGSSKZzw8RRA0'}
              model='gemini-1.5-flash'
              className="..."
            />
          ) : (
            <div>API Key is missing!</div>
          )}
        </div>
      )}
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <div className="text-blue-600 mb-4 flex justify-center">{icon}</div>
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default HomePage;