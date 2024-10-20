import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <GraduationCap className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl">YKS Asistanı</span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/login" className="hover:text-blue-200">Giriş</Link>
            <Link to="/register" className="hover:text-blue-200">Kayıt Ol</Link>
            <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
            <Link to="/subject-explanation" className="hover:text-blue-200">Konu Açıklamaları</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;