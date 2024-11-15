import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Giriş yapma fonksiyonu
export const login = (username: string, password: string) =>
  api.post('/users/login', { username, password });

// JSON formatında veri kabul eden kayıt fonksiyonu
  export const register = async (data: {
    username: string;
    email: string;
    password: string;
    profileImage: string | null;
    typeofintelligence: string;
  }) => {
    try {
      const response = await api.post('/users/register', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.error('Kayıt sırasında hata oluştu:', error);
      throw new Error('Kayıt işlemi başarısız oldu');
    }
  };


// Kullanıcı profilini alma fonksiyonu
export const getUserProfile = () => api.get('/users/profile');

// Konuları alma fonksiyonu
export const getSubjects = () => api.get('/subjects');

// Belirli bir konuyu ID ile alma fonksiyonu
export const getSubjectById = (id: string) => api.get(`/subjects/${id}`);

// Kullanıcı profilini JSON formatında güncelleme fonksiyonu
export const updateUserProfile = async (data: { profileImage?: string }) => {
  try {
    const response = await api.put('/users/profile', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Profil güncellenirken hata oluştu:', error);
    throw new Error('Profil güncellenemedi');
  }
};

// Şifre güncelleme fonksiyonu
export const updateUserPassword = async (data: { oldPassword: string; newPassword: string }) => {
  try {
    const response = await api.put('/users/password', data);
    return response;
  } catch (error) {
    console.error('Şifre güncellenirken hata oluştu:', error);
    throw new Error('Şifre güncellenemedi');
  }
};

export default api;
