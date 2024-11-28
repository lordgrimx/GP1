/**
 * @file    RegisterPage.tsx
 * @desc    Kullanıcı kayıt sayfası
 * @details Yeni kullanıcıların sisteme kaydolabildiği, profil bilgilerini ve zeka testi sonuçlarını girebildiği sayfa
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkUserExists, register } from '../api/api';
import ZekaTestiComponent from '../components/ZekaTestiComponent';
import defaultPP from '../../backend/defaultPP.json';
import { showToast } from '../utils/toast';
import { useTheme } from '../context/ThemeContext';

/**
 * @component RegisterPage
 * @desc     Kullanıcı kayıt formu ve zeka testi sürecini yöneten bileşen
 * @returns  {JSX.Element} Kayıt sayfası yapısı
 * 
 * @states
 * - username: Kullanıcı adı
 * - email: E-posta adresi
 * - password: Şifre
 * - profileImage: Profil fotoğrafı (base64)
 * - error: Hata mesajı
 * - success: Başarı mesajı
 * - showZekaTesti: Zeka testi görünürlük durumu
 * 
 * @validations
 * - Email format kontrolü
 * - Zorunlu alan kontrolü
 * - Profil resmi kontrolü
 * 
 * @sections
 * - Registration Form: Kayıt formu
 * - Profile Image: Profil fotoğrafı yükleme
 * - Intelligence Test: Zeka testi bileşeni
 */
const RegisterPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  /**
   * @state Form verileri ve durumları
   */
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(defaultPP.defaultProfileImagePath);
  const [error] = useState('');
  const [success] = useState('');
  const [showZekaTesti, setShowZekaTesti] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * @effect
   * @desc   Token kontrolü yaparak giriş yapmış kullanıcıyı anasayfaya yönlendiren effect hook
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  /**
   * @function convertToBase64
   * @desc     Profil fotoğrafını base64 formatına çeviren yardımcı fonksiyon
   * @param    {File} file - Yüklenen dosya
   * @returns  {Promise<string | null>} Base64 formatında resim verisi
   */
  const convertToBase64 = (file: File) => {
    return new Promise<string | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  /**
   * @function handleProfileImageChange
   * @desc     Profil fotoğrafı değişikliğini işleyen fonksiyon
   * @param    {React.ChangeEvent<HTMLInputElement>} e - Input değişiklik eventi
   */
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const base64 = await convertToBase64(file);
      setProfileImage(base64);
    }
  };

  /**
   * @function handleSubmit
   * @desc     Kayıt formunu işleyen ve kullanıcı kontrolü yapan fonksiyon
   * @param    {React.FormEvent} e - Form submit eventi
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Form validasyonu
      if (!username || !email || !password) {
        showToast.error('Lütfen tüm zorunlu alanları doldurun.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast.error('Geçerli bir e-posta adresi giriniz.');
        return;
      }

      // Kullanıcı varlık kontrolü
      const checkResult = await checkUserExists(username, email);
      
      if (checkResult.exists) {
        showToast.error(checkResult.message || 'Bu kullanıcı adı veya e-posta adresi zaten kullanımda.');
        return;
      }

      // Kullanıcı mevcut değilse zeka testine geç
      setShowZekaTesti(true);
      
    } catch (error: any) {
      console.error('Form gönderme hatası:', error);
      showToast.error(
        error.response?.data?.message || 
        'Bir hata oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * @constant canProceed
   * @desc    İlerleme butonunun aktif olup olmadığını kontrol eden değişken
   */
  const canProceed = username && email && password;

  /**
   * @constant Stil sınıfları
   */
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

  const handleTestSubmit = async (sonuc: any) => {
    try {
      const response = await register({
        username: sonuc.username,
        email: sonuc.email,
        password: sonuc.password,
        profileImage: sonuc.profileImage,
        typeofintelligence: sonuc.typeofintelligence
      });

      if (response.data) {
        showToast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
      }
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      showToast.error(
        error.response?.data?.message || 
        'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.'
      );
      throw error; // ZekaTestiComponent'in de hata yakalamasını sağlar
    }
  };

  return (
    <div className={`min-h-screen w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {showZekaTesti ? (
        <div className="w-full min-h-screen">
          <div className="max-w-[1920px] mx-auto">
            <ZekaTestiComponent
              username={username}
              email={email}
              password={password}
              profileImage={profileImage}
              onSubmit={handleTestSubmit}
            />
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className={`p-8 rounded-lg shadow-lg ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
            }`}>
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
              <form onSubmit={handleSubmit}>
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
                  disabled={!canProceed || loading}
                  className={`mt-4 w-full py-2 rounded ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  {loading ? 'Kontrol Ediliyor...' : 'İlerle'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
