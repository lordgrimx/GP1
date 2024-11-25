import React, { useState, useEffect } from 'react';
//import { Lock } from 'lucide-react';
import { getUserProfile, updateUserPassword, updateUserProfile, updateUserProfilePicture } from '../api/api';

const ProfilePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeForm, setActiveForm] = useState<'password' | 'photo'>('password');
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserProfile();
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeForm === 'password') {
      if (newPassword && newPassword !== confirmNewPassword) {
        setError('New passwords do not match');
        return;
      }

      try {
        await updateUserPassword({ oldPassword, newPassword });
        setSuccess('Password updated successfully.');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Error updating password:', err);
        setError('Failed to update password');
        setTimeout(() => setError(''), 3000);
      }
    } else if (activeForm === 'photo' && profileImage) {
      const reader = new FileReader();
      reader.readAsDataURL(profileImage);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
          await updateUserProfile({ profileImage: base64data });
          setSuccess('Profile photo updated successfully.');
        } catch (err) {
          setError('Failed to update profile photo');
        }
      };
    }
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const formData = new FormData();
      formData.append('profileImage', file);
      try {
        await updateUserProfilePicture(formData);
        setSuccess('Profil fotoğrafı başarıyla güncellendi.');
      } catch (err) {
        setError('Profil fotoğrafı güncellenemedi.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Your Profile</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 ${activeForm === 'password' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveForm('password')}
          >
            Update Password
          </button>
          <button
            className={`px-4 py-2 ${activeForm === 'photo' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveForm('photo')}
          >
            Update Photo
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {activeForm === 'password' ? (
            <>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                <input
                  type="text"
                  id="username"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={username}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={email}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label htmlFor="oldPassword" className="block text-gray-700 text-sm font-bold mb-2">Old Password</label>
                <input
                  type="password"
                  id="oldPassword"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="mb-6">
              <label htmlFor="profileImage" className="block text-gray-700 text-sm font-bold mb-2">Profile Image</label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {activeForm === 'password' ? 'Update Password' : 'Update Photo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
