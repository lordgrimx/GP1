import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Lock, User, Mail, Check, X } from 'lucide-react';
import { getUserProfile, updateUserProfile, updateUserPassword, updateUserProfilePicture } from '../api/api';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    profileImage: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfileData, setTempProfileData] = useState(profileData);

  // Animasyon varyantları
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

  const tabVariants = {
    inactive: { color: theme === 'dark' ? '#9CA3AF' : '#6B7280' },
    active: { 
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
      transition: { duration: 0.2 }
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        setProfileData(response.data);
        setTempProfileData(response.data);
        setIsLoading(false);
      } catch (error) {
        toast.error('Profil bilgileri yüklenemedi');
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      await updateUserProfile(tempProfileData);
      setProfileData(tempProfileData);
      setIsEditing(false);
      toast.success('Profil güncellendi');
    } catch (error) {
      toast.error('Profil güncellenemedi');
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }
    try {
      await updateUserPassword(passwordData);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Şifre güncellendi');
    } catch (error) {
      toast.error('Şifre güncellenemedi');
    }
  };

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
        toast.success('Profil fotoğrafı güncellendi');
      } catch (error) {
        toast.error('Profil fotoğrafı güncellenemedi');
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
