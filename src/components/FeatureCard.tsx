import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`p-6 rounded-xl shadow-lg ${
        theme === 'dark' 
          ? 'bg-gray-800 hover:bg-gray-700' 
          : 'bg-white hover:bg-gray-50'
      } transition-all duration-300`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
          {icon}
        </div>
        <h3 className={`mt-4 text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;