import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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
  typeofintelligence: object;
}) => {
  try {
    const response = await api.post('/users/register', data);
    return response;
  } catch (error) {
    console.error('Kayıt sırasında hata oluştu:', error);
    throw new Error('Kayıt işlemi başarısız oldu');
  }
};

// Kullanıcı profilini alma fonksiyonu
export const getUserProfile = () => api.get('/users/profile');

// Dersler API'leri
export const getSubjects = () => api.get('/subjects');
export const getSubjectById = (id: string) => api.get(`/subjects/${id}`);
export const addSubject = (data: { lesson: string; questionNumber: number; subjects?: Map<string, string> }) =>
  api.post('/subjects', data);
export const updateSubject = (id: string, data: { lesson?: string; questionNumber?: number; subjects?: Map<string, string> }) =>
  api.put(`/subjects/${id}`, data);
export const deleteSubject = (id: string) => api.delete(`/subjects/${id}`);
export const getSubjectNames = () => api.get('/subjects/names');

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

// Kullanıcı profil fotoğrafını güncelleme fonksiyonu
export const updateUserProfilePicture = async (formData: FormData) => {
  try {
    const response = await api.put('/users/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Profil fotoğrafı güncellenirken hata oluştu:', error);
    throw new Error('Profil fotoğrafı güncellenemedi');
  }
};

// Kullanıcının zeka türlerini alma fonksiyonu
export const getUserIntelligence = () => api.get('/users/intelligence');

// Test Track API'leri
export const getTestTracks = () => api.get('/testtrack');
export const addTestTrack = (data: {
  examName: string;
  examType: string;
  subjects: { [key: string]: { correct: number; incorrect: number; empty: number } };
}) => api.post('/testtrack', data);
export const updateTestTrack = (id: string, data: {
  examName: string;
  examType: string;
  subjects: { [key: string]: { correct: number; incorrect: number; empty: number } };
}) => api.put(`/testtrack/${id}`, data);

export default api;
