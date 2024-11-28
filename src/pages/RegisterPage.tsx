import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/api';
import ZekaTestiComponent from '../components/ZekaTestiComponent';
import defaultPP from '../../backend/defaultPP.json';
import { showToast } from '../utils/toast';
import { useTheme } from '../context/ThemeContext';

const RegisterPage: React.FC = () => {
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(defaultPP.defaultProfileImagePath);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showZekaTesti, setShowZekaTesti] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/'); // Giriş yapmışsa anasayfaya yönlendir
    }
  }, [token, navigate]);

  const convertToBase64 = (file: File) => {
    return new Promise<string | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const base64 = await convertToBase64(file);
      setProfileImage(base64); // Yeni yüklenen resmi güncelle
    }
  };

  const handleSubmitZekaTesti = async (zekaTestiSonuclari: { [key: string]: number }) => {
    try {
      // İstek öncesi verileri kontrol et
      if (!username || !email || !password) {
        showToast.error('Lütfen tüm zorunlu alanları doldurun.');
        return;
      }

      // Email formatını kontrol et
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast.error('Geçerli bir e-posta adresi giriniz.');
        return;
      }

      const userData = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        profileImage: profileImage || defaultPP.defaultProfileImagePath,
        typeofintelligence: zekaTestiSonuclari
      };

      const response = await register(userData);
      
      if (response.success) {
        showToast.success('Kayıt başarıyla tamamlandı!');
        // Kısa bir gecikme ekleyerek toast mesajının görünmesini sağlayalım
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        throw new Error(response.message || 'Kayıt işlemi başarısız oldu.');
      }
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.';
      showToast.error(errorMessage);
    }
  };

  const canProceed = username && email && password; // Profil resmi hariç diğer tüm alanlar dolu mu?

  const inputClass = `w-full p-3 rounded border ${
    theme === 'dark' 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300'
  }`;

  const formClass = `max-w-md mx-auto p-8 rounded-lg shadow-lg ${
    theme === 'dark' 
      ? 'bg-gray-800 text-white' 
      : 'bg-white'
  }`;

  if (showZekaTesti) {
    return (
      <ZekaTestiComponent
        username={username}
        email={email}
        password={password}
        profileImage={profileImage}
        onSubmit={handleSubmitZekaTesti}
      />
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className={formClass}>
          <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}
          <div className="flex justify-center mb-6">
            <img
              src={profileImage || defaultPP.defaultProfileImagePath} // Profil resmi veya varsayılan
              alt="Profile Preview"
              className="w-24 h-24 rounded-full border border-gray-300"
            />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setShowZekaTesti(true); }}>
            <div>
              <label htmlFor="username" className="block mb-1">Kullanıcı Adı</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1">E-posta</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1">Şifre</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="profileImage" className="block mb-1">Profil Fotoğrafı</label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleProfileImageChange}
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={!canProceed}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
            >
              İlerle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
