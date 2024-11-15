import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/api';
import ZekaTestiComponent from '../components/ZekaTestiComponent';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
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

  // Dosyayı base64 formatına dönüştürme fonksiyonu
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
      setProfileImage(base64);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      username,
      email,
      password,
      profileImage,
    };

    try {
      const response = await register(userData);
      setSuccess('Kayıt başarıyla oluşturuldu! Giriş yapabilirsiniz.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const canProceed = username && email && password; // Profil resmi hariç diğer tüm alanlar dolu mu?

  if (showZekaTesti) {
    // Zeka testi komponenti gösteriliyor
    return <ZekaTestiComponent />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <div className="flex justify-center mb-4">
          <img
            src={profileImage || 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg'}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full border"
          />
        </div>
        <form onSubmit={handleSubmit}>
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
            type="button"
            onClick={() => setShowZekaTesti(true)}
            disabled={!canProceed}
            className={`w-full py-2 rounded ${canProceed ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
          >
            İlerle
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
