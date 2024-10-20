import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">YKS Sınav Hazırlık Asistanına Hoş Geldiniz</h1>
      <p className="text-xl mb-8">Üniversite sınavına hazırlanırken size yardımcı olacak araçlar ve kaynaklar sunuyoruz.</p>
      <div className="space-x-4">
        <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Hemen Başla
        </Link>
        <Link to="/login" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Giriş Yap
        </Link>
      </div>
    </div>
  );
};

export default Home;