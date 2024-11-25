import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/api';
import ZekaTestiComponent from '../components/ZekaTestiComponent';
import defaultPP from '../../backend/defaultPP.json';

const RegisterPage: React.FC = () => {
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

  const handleSubmitZekaTesti = async (sonuc: any) => {
    if (!sonuc || Object.keys(sonuc).length === 0) {
      setError('Zeka testi sonucu eksik veya hatalı. Lütfen testi tamamlayın.');
      return;
    }

    const userData = {
      username,
      email,
      password,
      profileImage,
      typeofintelligence: sonuc, // Zeka testi sonucu burada ekleniyor
    };

    try {
      const response = await register(userData);
      console.log('Kayıt Başarılı:', response);
      setSuccess('Kayıt başarıyla oluşturuldu! Giriş yapabilirsiniz.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Kayıt sırasında hata oluştu:', err);
      setError('Kayıt işlemi başarısız oldu.');
    }
  };

  const canProceed = username && email && password; // Profil resmi hariç diğer tüm alanlar dolu mu?

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
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
              className="w-full px-3 py-2 border rounded"
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
              className="w-full px-3 py-2 border rounded"
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
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="profileImage" className="block mb-1">Profil Fotoğrafı</label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="w-full px-3 py-2 border rounded"
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
  );
};

export default RegisterPage;
