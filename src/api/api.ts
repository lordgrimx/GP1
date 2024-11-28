/**
 * @file    api.ts
 * @desc    Backend API ile iletişim için servis katmanı
 * @details Tüm HTTP istekleri ve veri tipleri bu dosyada yönetilir
 */

import axios from 'axios';

/**
 * @desc    API temel URL yapılandırması
 * @type    {string}
 * @default http://localhost:3000/api
 * @note    Üretim ortamında REACT_APP_API_URL env değişkeni kullanılır
 */
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * @desc    Test sonucu gönderme isteği için tip tanımı
 * @interface TestTrackRequest
 * @property {string} examName - Sınav adı (örn: "Deneme 1")
 * @property {('TYT'|'AYT')} examType - Sınav türü
 * @property {string} [aytField] - AYT alan türü (sadece AYT için gerekli)
 * @property {string} [linkedExamId] - Bağlantılı TYT sınavının ID'si (AYT için)
 * @property {Object} subjects - Ders bazlı sonuçlar
 * @property {number} subjects[key].correct - Doğru sayısı
 * @property {number} subjects[key].incorrect - Yanlış sayısı
 * @property {number} subjects[key].empty - Boş sayısı
 * @property {number} [subjects[key].net] - Net sayısı (otomatik hesaplanır)
 */
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

/**
 * @desc    Test sonucu yanıtı için genişletilmiş tip tanımı
 * @interface Track
 * @extends TestTrackRequest
 * @property {string} _id - MongoDB tarafından oluşturulan benzersiz ID
 * @property {string} user - Kullanıcı ID'si
 * @property {number} totalNet - Tüm derslerden elde edilen toplam net
 * @property {number} examScore - Sınav ham puanı
 * @property {number} [finalScore] - Yerleştirme puanı (opsiyonel)
 * @property {string} createdAt - Oluşturulma tarihi (ISO string)
 * @property {string} updatedAt - Son güncelleme tarihi (ISO string)
 */
export interface Track extends TestTrackRequest {
  _id: string;
  user: string;
  totalNet: number;
  examScore: number;
  finalScore?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * @desc    Axios instance yapılandırması
 * @details Tüm API istekleri için temel ayarları içerir
 * @config
 *   - baseURL: API'nin temel URL'i
 *   - headers: Varsayılan header'lar
 * @note    Bu instance üzerinden yapılan tüm istekler otomatik olarak
 *          baseURL'i kullanır ve Content-Type header'ı ekler
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * @desc    İstek interceptor'ı - Token ekleme
 * @details Her API isteğine otomatik olarak Authorization token'ı ekler
 * @param   {AxiosRequestConfig} config - Axios istek konfigürasyonu
 * @returns {AxiosRequestConfig} Güncellenmiş konfigurasyon
 * @throws  {Error} Token eksikse veya geçersizse
 * @note    localStorage'dan token'ı alır ve Bearer şeması ile ekler
 */
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

/**
 * @desc    Giriş yanıtı için tip tanımı
 * @interface LoginResponse
 * @property {boolean} success - İşlem başarı durumu
 * @property {string} [message] - Sunucudan dönen mesaj
 * @property {string} [token] - JWT authentication token
 * @property {Object} [user] - Kullanıcı bilgileri
 * @property {string} user._id - Kullanıcı ID'si
 * @property {string} user.username - Kullanıcı adı
 * @property {string} user.email - E-posta adresi
 * @property {string} [user.profileImage] - Profil fotoğrafı URL'i
 * @property {Object} [user.typeofintelligence] - Zeka türü değerlendirmesi
 */
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

/**
 * @desc    Kullanıcı girişi fonksiyonu
 * @route   POST /api/users/login
 * @param   {string} identifier - Kullanıcı adı veya e-posta
 * @param   {string} password - Kullanıcı şifresi
 * @returns {Promise<LoginResponse>} Giriş işlemi sonucu
 * @throws  {Error} Giriş başarısız olduğunda
 * @note    Başarılı girişte token localStorage'a kaydedilir
 */
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

/**
 * @desc    Kayıt yanıtı için tip tanımı
 * @interface RegisterResponse
 * @property {boolean} success - İşlem başarı durumu
 * @property {string} [message] - Sunucudan dönen mesaj
 * @property {any} [data] - Ek kayıt bilgileri
 */
interface RegisterResponse {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * @desc    Kayıt verisi için tip tanımı
 * @interface RegisterData
 * @property {string} username - Kullanıcı adı
 * @property {string} email - E-posta adresi
 * @property {string} password - Şifre
 * @property {string|null} profileImage - Profil fotoğrafı (base64)
 * @property {Object} typeofintelligence - Zeka türü değerlendirme sonuçları
 */
interface RegisterData {
  username: string;
  email: string;
  password: string;
  profileImage: string | null;
  typeofintelligence: { [key: string]: number };
}

/**
 * @desc    Kullanıcı kaydı fonksiyonu
 * @route   POST /api/users/register
 * @param   {RegisterData} data - Kayıt bilgileri
 * @returns {Promise<RegisterResponse>} Kayıt işlemi sonucu
 * @throws  {Error} Kayıt başarısız olduğunda
 */
export const register = async (data: RegisterData): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(`${API_URL}/users/register`, data);
  return response.data;
};

// Kullanıcı varlık kontrolü fonksiyonu
/**
 * @function checkUserExists
 * @desc     Kullanıcı adı veya email'in sistemde kayıtlı olup olmadığını kontrol eder
 * @route    POST /api/users/check-user
 * 
 * @param    {string} username - Kontrol edilecek kullanıcı adı
 * @param    {string} email - Kontrol edilecek email adresi
 * 
 * @returns  {Promise<Object>} Kontrol sonucu
 * @property {boolean} exists - Kullanıcının var olup olmadığı
 * @property {string} message - Sonuç mesajı
 * 
 * @throws   {Error} API isteği başarısız olursa
 */
export const checkUserExists = async (username: string, email: string) => {
  try {
    const response = await api.post('/users/check-user', {
      username: username.trim(),
      email: email.trim().toLowerCase()
    });
    return response.data;
  } catch (error) {
    console.error('Kullanıcı kontrol hatası:', error);
    throw error;
  }
};

/**
 * @desc    Kullanıcı profili işlemleri
 * @route   GET /api/users/profile
 * @returns {Promise<AxiosResponse>} Kullanıcı profil bilgileri
 * @note    Protected route - Token gerektirir
 */
export const getUserProfile = () => api.get('/users/profile');

/**
 * @desc    Ders işlemleri
 */
export const getSubjects = () => api.get('/subjects');
export const getSubjectById = (id: string) => api.get(`/subjects/${id}`);
export const addSubject = (data: { lesson: string; questionNumber: number; subjects?: Map<string, string> }) =>
  api.post('/subjects', data);
export const updateSubject = (id: string, data: { lesson?: string; questionNumber?: number; subjects?: Map<string, string> }) =>
  api.put(`/subjects/${id}`, data);
export const deleteSubject = (id: string) => api.delete(`/subjects/${id}`);
export const getSubjectNames = () => api.get('/subjects/names');

/**
 * @desc    Profil güncelleme işlemleri
 */
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

/**
 * @desc    Şifre güncelleme işlemi
 * @route   PUT /api/users/password
 * @param   {Object} data - Şifre bilgileri
 * @param   {string} data.oldPassword - Mevcut şifre
 * @param   {string} data.newPassword - Yeni şifre
 * @returns {Promise<AxiosResponse>} Güncelleme sonucu
 * @throws  {Error} Güncelleme başarısız olduğunda
 * @note    Protected route - Token gerektirir
 */
export const updateUserPassword = async (data: { oldPassword: string; newPassword: string }) => {
  try {
    const response = await api.put('/users/password', data);
    return response;
  } catch (error) {
    console.error('Şifre güncellenirken hata oluştu:', error);
    throw new Error('Şifre güncellenemedi');
  }
};

/**
 * @desc    Profil fotoğrafı güncelleme işlemi
 * @route   PUT /api/users/profile-photo
 * @param   {FormData} formData - Fotoğraf verisi
 * @returns {Promise<string>} Base64 formatında profil fotoğrafı
 * @throws  {Error} Güncelleme başarısız olduğunda
 */
export const updateUserProfilePicture = async (formData: FormData) => {
  try {
    const imageFile = formData.get('profileImage') as File;
    if (!imageFile) {
      throw new Error('Dosya bulunamadı');
    }

    console.log('Yüklenecek dosya:', {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size
    });

    // Direkt olarak FormData gönder
    const response = await api.put('/users/profile-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    console.log('API yanıtı:', response.data);
    
    if (response.data?.profileImage) {
      return response.data.profileImage;
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Profil fotoğrafı yükleme hatası:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || 'Geçersiz dosya formatı veya boyutu. Lütfen başka bir fotoğraf deneyin.';
      throw new Error(errorMessage);
    } else if (error.response?.status === 413) {
      throw new Error('Dosya boyutu çok büyük. Lütfen daha küçük bir fotoğraf seçin.');
    }
    
    throw new Error('Profil fotoğrafı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
  }
};

/**
 * @desc    Kullanıcı zeka türü bilgisi alma
 * @route   GET /api/users/intelligence
 * @returns {Promise<AxiosResponse>} Zeka türü değerlendirme sonuçları
 * @note    Protected route - Token gerektirir
 */
export const getUserIntelligence = () => api.get('/users/intelligence');

/**
 * @desc    Test takip işlemleri
 * @routes
 *   GET    /api/testtrack - Tüm test sonuçlarını getir
 *   POST   /api/testtrack - Yeni test sonucu ekle
 *   PUT    /api/testtrack/:id - Test sonucu güncelle
 *   DELETE /api/testtrack/:id - Test sonucu sil
 * @note    Tüm route'lar protected - Token gerektirir
 */
export const getTestTracks = () => api.get('/testtrack');
export const addTestTrack = (data: TestTrackRequest) => api.post('/testtrack', data);
export const updateTestTrack = async (id: string, data: TestTrackRequest) => {
    const response = await api.put(`/testtrack/${id}`, data);
    return response;
};
export const deleteTestTrack = (id: string) => api.delete(`/testtrack/${id}`);

/**
 * @desc    Kullanıcı istatistikleri alma
 * @route   GET /api/users/stats
 * @returns {Promise<AxiosResponse>} Kullanıcının performans istatistikleri
 * @note    Protected route - Token gerektirir
 *          Manuel olarak token header'a eklenir
 */
export const getUserStats = () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/users/stats`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

/**
 * @desc    TYT ve AYT dersleri alma
 * @routes
 *   GET /api/subjects/tyt - TYT derslerini getir
 *   GET /api/subjects/ayt - AYT derslerini getir
 * @returns {Promise<AxiosResponse>} Ders listesi
 * @note    Protected routes - Token gerektirir
 */
export const getTYTSubjects = () => api.get('/subjects/tyt');
export const getAYTSubjects = () => api.get('/subjects/ayt');

/**
 * @desc    Auth header oluşturma yardımcı fonksiyonu
 * @returns {Object} Authorization ve Content-Type header'ları
 * @note    Token yoksa boş Authorization header'ı döner
 */
const authHeader = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
    };
};

/**
 * @desc    Bağlantılı test takibi yanıtı için tip tanımı
 * @interface LinkedTestTrackResponse
 * @property {Track} exam1 - İlk sınav (genellikle TYT)
 * @property {Track} exam2 - İkinci sınav (genellikle AYT)
 * @property {number} finalScore - Hesaplanan yerleştirme puanı
 */
export interface LinkedTestTrackResponse {
    exam1: Track;
    exam2: Track;
    finalScore: number;
}

/**
 * @desc    Bağlantılı test sonuçlarını getirme
 * @route   GET /api/testtrack/linked
 * @returns {Promise<AxiosResponse<LinkedTestTrackResponse[]>>}
 * @throws  {Error} İstek başarısız olduğunda
 * @note    Protected route - Token gerektirir
 */
export const getLinkedTestTracks = async () => {
  try {
    const response = await axios.get<LinkedTestTrackResponse[]>(
      `${API_URL}/testtrack/linked`,
      { headers: authHeader() }
    );
    console.log('API Response:', response.data);
    return response;
  } catch (error) {
    console.error('getLinkedTestTracks error:', error);
    throw error;
  }
};

/**
 * @desc    Soru ve çözüm kaydetme isteği için tip tanımı
 * @interface QuestionSaveRequest
 * @property {string} imageData - Soru görselinin base64 formatında verisi
 * @property {string} solution - Sorunun çözümü/açıklaması
 */
export interface QuestionSaveRequest {
    imageData: string;
    solution: string;
}

/**
 * @desc    Soru kaydetme işlemi
 * @route   POST /api/questions
 * @param   {QuestionSaveRequest} data - Soru ve çözüm bilgileri
 * @returns {Promise<AxiosResponse>} Kayıt işlemi sonucu
 * @throws  {Error} Kayıt başarısız olduğunda
 * @note    Protected route - Token gerektirir
 *          Görsel base64 formatında gönderilmelidir
 */
export const saveQuestionWithSolution = async (data: QuestionSaveRequest) => {
    return api.post('/questions', data, { headers: authHeader() });
};

/**
 * @desc    Kullanıcının kaydettiği soruları getirme
 * @route   GET /api/questions
 * @returns {Promise<AxiosResponse>} Kaydedilmiş sorular listesi
 * @note    Protected route - Token gerektirir
 */
export const getUserQuestions = () => {
    return api.get('/questions', { headers: authHeader() });
};

/**
 * @desc    Konu yeterliliği güncelleme
 * @route   POST /api/subjects/:id/proficiency
 * @param   {string} subjectId - Ders/konu ID'si
 * @param   {string} topicName - Alt konu adı
 * @param   {number} level - Yeterlilik seviyesi (0-100 arası)
 * @returns {Promise<AxiosResponse>} Güncelleme sonucu
 * @note    Protected route - Token gerektirir
 */
export const updateSubjectProficiency = (subjectId: string, topicName: string, level: number) => {
    return api.post(
        `/subjects/${subjectId}/proficiency`, 
        { topicName, level },
        { headers: authHeader() }
    );
};

/**
 * @desc    Gemini AI yanıtı alma
 * @route   POST /api/gemini/generate
 * @param   {string} prompt - AI'ya gönderilecek soru/istek metni
 * @returns {Promise<AxiosResponse>} AI'dan gelen yanıt
 * @throws  {Error} İstek başarısız olduğunda
 * @note    Rate limiting uygulanabilir
 *          Yanıt formatı yapılandırılmış metin içerir
 */
export const getGeminiResponse = async (prompt: string) => {
    return api.post('/gemini/generate', { prompt });
};

export default api;

