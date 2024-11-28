import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Interface tanımlamaları
export interface TestTrackRequest {
  examName: string;
  examType: 'TYT' | 'AYT';
  aytField?: 'Sayısal' | 'Sözel' | 'Eşit Ağırlık' | 'Yabancı Dil';
  linkedExamId?: string;
  subjects: {
    [key: string]: {
      correct: number;
      incorrect: number;
      empty: number;
      net?: number;
    };
  };
}

export interface Track extends TestTrackRequest {
  _id: string;
  user: string;
  totalNet: number;
  examScore: number;
  finalScore?: number;
  createdAt: string;
  updatedAt: string;
}

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
interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    _id: string;
    username: string;
    email: string;
    profileImage?: string;
    typeofintelligence?: { [key: string]: number };
  };
}

export const login = async (identifier: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/users/login`, {
    identifier,
    password
  });
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

// JSON formatında veri kabul eden kayıt fonksiyonu
interface RegisterResponse {
  success: boolean;
  message?: string;
  data?: any;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  profileImage: string | null;
  typeofintelligence: { [key: string]: number };
}

export const register = async (data: RegisterData): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(`${API_URL}/users/register`, data);
  return response.data;
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
export const addTestTrack = (data: TestTrackRequest) => api.post('/testtrack', data);
export const updateTestTrack = async (id: string, data: TestTrackRequest) => {
  const response = await api.put(`/testtrack/${id}`, data);
  return response;
};
export const deleteTestTrack = (id: string) => api.delete(`/testtrack/${id}`);

export const getUserStats = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/users/stats`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// TYT derslerini getirme fonksiyonu
export const getTYTSubjects = () => api.get('/subjects/tyt');

// AYT derslerini getirme fonksiyonu
export const getAYTSubjects = () => api.get('/subjects/ayt');

// Auth header helper fonksiyonu
const authHeader = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};

// Bağlı denemeleri getirme fonksiyonu
export const getLinkedTestTracks = async () => {
  try {
    const response = await axios.get<LinkedTestTrackResponse[]>(
      `${API_URL}/testtrack/linked`,
      { headers: authHeader() }
    );
    console.log('API Response:', response.data); // Debug log
    return response;
  } catch (error) {
    console.error('getLinkedTestTracks error:', error);
    throw error;
  }
};

// Tip tanımlamalarını güncelleyelim
export interface LinkedTestTrackResponse {
  exam1: Track;
  exam2: Track;
  finalScore: number;
}

// Soru ve çözüm kaydetme interface'i
export interface QuestionSaveRequest {
  imageData: string;
  solution: string;
}

// Soru ve çözüm kaydetme fonksiyonu
export const saveQuestionWithSolution = async (data: QuestionSaveRequest) => {
  return api.post('/questions', data, { headers: authHeader() });
};

// Kullanıcının çözülmüş sorularını getirme fonksiyonu
export const getUserQuestions = () => {
  return api.get('/questions', { headers: authHeader() });
};

// Yeni eklenen proficiency API fonksiyonu
export const updateSubjectProficiency = (subjectId: string, topicName: string, level: number) => {
  return api.post(
    `/subjects/${subjectId}/proficiency`, 
    { topicName, level },
    { headers: authHeader() }
  );
};

export const getGeminiResponse = async (prompt: string) => {
  return api.post('/gemini/generate', { prompt });
};

export default api;

