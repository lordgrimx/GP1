/**
 * @file    ProfilePage.tsx
 * @desc    Kullanıcı profil sayfası
 * @details Kullanıcının profil bilgilerini görüntüleyebildiği, düzenleyebildiği ve güvenlik ayarlarını yönetebildiği sayfa
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Lock, User, Check, X } from 'lucide-react';
import { getUserProfile, updateUserProfile, updateUserPassword, updateUserProfilePicture } from '../api/api';
import { useTheme } from '../context/ThemeContext';
import { showToast } from '../utils/toast';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * @component ProfilePage
 * @desc     Kullanıcı profil yönetimi sayfası
 * @returns  {JSX.Element} Profil sayfası yapısı
 * 
 * @states
 * - isLoading: Sayfa yükleme durumu
 * - activeTab: Aktif sekme (profil/güvenlik)
 * - profileData: Kullanıcı profil bilgileri
 * - passwordData: Şifre değişikliği verileri
 * - isEditing: Profil düzenleme modu durumu
 * - tempProfileData: Geçici profil düzenleme verileri
 * 
 * @animations
 * - containerVariants: Ana içerik için animasyon ayarları
 * - tabVariants: Sekme geçişleri için animasyon ayarları
 * 
 * @sections
 * - Profile Header: Profil fotoğrafı ve kullanıcı bilgileri
 * - Tab Menu: Profil ve güvenlik sekmeleri
 * - Profile Form: Profil bilgileri düzenleme formu
 * - Security Form: Şifre değiştirme formu
 */
const ProfilePage: React.FC = () => {
  const { theme } = useTheme();

  /**
   * @state isLoading
   * @desc  Sayfa yükleme durumunu kontrol eden state
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * @state activeTab
   * @desc  Aktif sekmeyi tutan state
   */
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  /**
   * @state profileData
   * @desc  Kullanıcı profil bilgilerini tutan state
   */
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    profileImage: '',
  });

  /**
   * @state passwordData
   * @desc  Şifre değişikliği verilerini tutan state
   */
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  /**
   * @state isEditing
   * @desc  Profil düzenleme modunu kontrol eden state
   */
  const [isEditing, setIsEditing] = useState(false);

  /**
   * @state tempProfileData
   * @desc  Geçici profil düzenleme verilerini tutan state
   */
  const [tempProfileData, setTempProfileData] = useState(profileData);

  /**
   * @constant containerVariants
   * @desc    Ana içerik için animasyon konfigürasyonu
   */
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  /**
   * @constant tabVariants
   * @desc    Sekme geçişleri için animasyon konfigürasyonu
   */
  const tabVariants = {
    inactive: { color: theme === 'dark' ? '#9CA3AF' : '#6B7280' },
    active: { 
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
      transition: { duration: 0.2 }
    }
  };

  /**
   * @effect
   * @desc   Sayfa yüklendiğinde profil verilerini çeken effect hook
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        setProfileData(response.data);
        setTempProfileData(response.data);
        setIsLoading(false);
      } catch (error) {
        showToast.error('Profil bilgileri yüklenemedi');
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  /**
   * @function handleProfileUpdate
   * @desc     Profil bilgilerini güncelleyen fonksiyon
   * @async
   */
  const handleProfileUpdate = async () => {
    try {
      await updateUserProfile(tempProfileData);
      setProfileData(tempProfileData);
      setIsEditing(false);
      showToast.success('Profil güncellendi');
    } catch (error) {
      showToast.error('Profil güncellenemedi');
    }
  };

  /**
   * @function handlePasswordUpdate
   * @desc     Kullanıcı şifresini güncelleyen fonksiyon
   * @async
   */
  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast.error('Şifreler eşleşmiyor');
      return;
    }
    try {
      await updateUserPassword(passwordData);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      showToast.success('Şifre güncellendi');
    } catch (error) {
      showToast.error('Şifre güncellenemedi');
    }
  };

  /**
   * @function handleImageUpload
   * @desc     Profil fotoğrafını güncelleyen fonksiyon
   * @async
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('profileImage', file);
        await updateUserProfilePicture(formData);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileData(prev => ({ ...prev, profileImage: reader.result as string }));
        };
        reader.readAsDataURL(file);
        showToast.success('Profil fotoğrafı güncellendi');
      } catch (error) {
        showToast.error('Profil fotoğrafı güncellenemedi');
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={`min-h-screen px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className="max-w-4xl mx-auto"
      >
        {/* Profil Başlığı */}
        <div className="text-center mb-8">
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={profileData.profileImage || 'default-avatar.png'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />
            <label className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </motion.div>
          <h1 className="mt-4 text-2xl font-bold">{profileData.username}</h1>
          <p className="text-gray-500">{profileData.email}</p>
        </div>

        {/* Tab Menüsü */}
        <div className="flex justify-center mb-8 border-b border-gray-200 dark:border-gray-700">
          <motion.button
            variants={tabVariants}
            animate={activeTab === 'profile' ? 'active' : 'inactive'}
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 ${activeTab === 'profile' ? 'border-b-2 border-blue-500' : ''}`}
          >
            <User className="inline-block mr-2 w-5 h-5" />
            Profil
          </motion.button>
          <motion.button
            variants={tabVariants}
            animate={activeTab === 'security' ? 'active' : 'inactive'}
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 ${activeTab === 'security' ? 'border-b-2 border-blue-500' : ''}`}
          >
            <Lock className="inline-block mr-2 w-5 h-5" />
            Güvenlik
          </motion.button>
        </div>

        {/* Tab İçerikleri */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={isEditing ? tempProfileData.username : profileData.username}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, username: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full p-2 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-white border-gray-300'
                    } ${!isEditing && 'opacity-75'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">E-posta</label>
                  <input
                    type="email"
                    value={isEditing ? tempProfileData.email : profileData.email}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, email: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full p-2 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-white border-gray-300'
                    } ${!isEditing && 'opacity-75'}`}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  {isEditing ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setIsEditing(false);
                          setTempProfileData(profileData);
                        }}
                        className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-5 h-5 inline-block mr-1" />
                        İptal
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleProfileUpdate}
                        className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                      >
                        <Check className="w-5 h-5 inline-block mr-1" />
                        Kaydet
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      Düzenle
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mevcut Şifre</label>
                  <input
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    className={`w-full p-2 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Yeni Şifre</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className={`w-full p-2 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Yeni Şifre (Tekrar)</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className={`w-full p-2 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePasswordUpdate}
                    className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    Şifreyi Güncelle
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
