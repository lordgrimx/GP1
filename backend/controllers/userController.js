import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import fs from 'fs';
import defaultPP from '../defaultPP.json' assert { type: 'json' };
import StudySession from '../models/studySession.js';
import TestResult from '../models/testResult.js';
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * @desc    Yeni kullanıcı kaydı oluşturur
 * @route   POST /api/users/register
 * @access  Public
 * @param   {string} username - Kullanıcı adı
 * @param   {string} email - E-posta adresi
 * @param   {string} password - Şifre
 * @param   {string} profileImage - Profil fotoğrafı (opsiyonel)
 * @param   {string} typeofintelligence - Zeka türü
 * @returns {object} Kayıt durumu mesajı
 */
export const registerUser = async (req, res) => {
  const { username, email, password, profileImage, typeofintelligence } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!typeofintelligence) {
      return res.status(400).json({ message: 'typeofintelligence is required' });
    }

    const user = new User({
      username,
      email,
      password,
      profileImage: profileImage || defaultPP.defaultProfileImagePath,
      typeOfIntelligence: typeofintelligence, // Zeka türü backend'e ekleniyor
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc    Kullanıcı girişi yapar
 * @route   POST /api/users/login
 * @access  Public
 * @param   {string} identifier - Kullanıcı adı veya e-posta
 * @param   {string} password - Şifre
 * @returns {object} Kullanıcı bilgileri ve JWT token
 */
export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        typeofintelligence: user.typeOfIntelligence,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ 
        success: false,
        message: 'Geçersiz kullanıcı adı/email veya şifre' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
};

/**
 * @desc    Kullanıcı profilini getirir
 * @route   GET /api/users/profile
 * @access  Private
 * @returns {object} Kullanıcı profil bilgileri
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc    Kullanıcı şifresini günceller
 * @route   PUT /api/users/password
 * @access  Private
 * @param   {string} oldPassword - Eski şifre
 * @param   {string} newPassword - Yeni şifre
 * @returns {object} Güncelleme durumu mesajı
 */
export const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (await user.matchPassword(oldPassword)) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(400).json({ message: 'Old password is incorrect' });
    }
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc    Kullanıcı profil fotoğrafını günceller
 * @route   PUT /api/users/profile-photo
 * @access  Private
 * @param   {File} profileImage - Yüklenecek profil fotoğrafı
 * @returns {object} Güncellenen profil fotoğrafı URL'si
 */
export const updateUserProfilePhoto = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Dosya kontrolü
        if (!req.file) {
            return res.status(400).json({ message: 'Dosya yüklenmedi' });
        }

        // Debug log
        console.log('Yüklenen dosya:', {
            fieldname: req.file.fieldname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            buffer: req.file.buffer ? 'Buffer mevcut' : 'Buffer yok'
        });

        try {
            // Buffer'ı base64'e çevir
            const base64Image = req.file.buffer.toString('base64');
            const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

            // Debug log
            console.log('Base64 dönüşümü yapıldı, uzunluk:', imageUrl.length);

            // Kullanıcı belgesini güncelle
            user.profileImage = imageUrl;
            const updatedUser = await user.save();

            // Debug log
            console.log('Kullanıcı güncellendi:', {
                userId: updatedUser._id,
                hasProfileImage: !!updatedUser.profileImage
            });

            return res.json({ 
                success: true,
                message: 'Profil fotoğrafı başarıyla güncellendi', 
                profileImage: updatedUser.profileImage 
            });
        } catch (conversionError) {
            console.error('Base64 dönüşüm hatası:', conversionError);
            return res.status(500).json({ 
                message: 'Resim dönüştürme işlemi başarısız oldu',
                error: conversionError.message 
            });
        }
    } catch (error) {
        console.error('Profil fotoğrafı güncellenirken hata oluştu:', error);
        res.status(500).json({ 
            success: false,
            message: 'Sunucu hatası',
            error: error.message 
        });
    }
};

/**
 * @desc    Kullanıcı profil bilgilerini günceller
 * @route   PUT /api/users/profile
 * @access  Private
 * @param   {string} username - Yeni kullanıcı adı (opsiyonel)
 * @param   {string} email - Yeni e-posta (opsiyonel)
 * @param   {string} profileImage - Yeni profil fotoğrafı (opsiyonel)
 * @param   {string} typeofintelligence - Yeni zeka türü (opsiyonel)
 * @returns {object} Güncellenmiş kullanıcı bilgileri
 */
export const updateUserProfile = async (req, res) => {
  const { username, email, profileImage, typeofintelligence } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.profileImage = profileImage || user.profileImage;
    user.typeOfIntelligence = typeofintelligence || user.typeOfIntelligence;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc    Kullanıcının zeka türlerini getirir
 * @route   GET /api/users/intelligence
 * @access  Private
 * @returns {array} Kullanıcının zeka türleri listesi
 */
export const getUserIntelligence = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('typeOfIntelligence'); // Sadece typeOfIntelligence alanını seç
    if (user) {
      res.json(user.typeOfIntelligence); // Sadece zeka türlerini döndür
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Intelligence fetch error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
/**
 * @function checkUserExists
 * @desc     Kullanıcı adı veya email'in sistemde kayıtlı olup olmadığını kontrol eder
 * @route    POST /api/users/check
 * @access   Public
 * 
 * @param    {Object} req - Express request nesnesi
 * @param    {Object} req.body - İstek gövdesi
 * @param    {string} req.body.username - Kontrol edilecek kullanıcı adı
 * @param    {string} req.body.email - Kontrol edilecek email adresi
 * 
 * @param    {Object} res - Express response nesnesi
 * 
 * @returns  {Object} Kontrol sonucu
 * @property {boolean} exists - Kullanıcının var olup olmadığı
 * @property {string} message - Sonuç mesajı
 * 
 * @throws   {Error} Veritabanı sorgusu başarısız olursa
 */
export const checkUserExists = async (req, res) => {
  const { username, email } = req.body;

  try {
    const userExists = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.trim() }
      ]
    });

    res.json({
      exists: !!userExists,
      message: userExists ? 'Kullanıcı zaten mevcut' : 'Kullanıcı mevcut değil'
    });
  } catch (error) {
    console.error('User check error:', error);
    res.status(500).json({ 
      message: 'Kullanıcı kontrolü sırasında bir hata oluştu', 
      error: error.message 
    });
  }
};

/**
 * @desc    Kullanıcının genel istatistiklerini getirir
 * @route   GET /api/users/stats
 * @access  Private
 * @returns {object} Toplam çalışma süresi, tamamlanan konular, soru sayısı vb.
 */
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Çalışma oturumlarını getir
    const studySessions = await StudySession.find({ userId });
    
    // Test sonuçlarını getir
    const testResults = await TestResult.find({ userId });

    // Benzersiz çalışılan konuları say
    const uniqueTopics = await StudySession.distinct('topicId', { userId });
    const completedTopics = uniqueTopics.length;

    // Toplam çalışma süresini hesapla (saat cinsinden)
    const totalStudyTime = studySessions.reduce((total, session) => total + session.duration, 0) / 60;

    // Toplam soru sayısı ve ortalama skoru hesapla
    const totalQuestions = testResults.reduce((total, result) => total + result.questionCount, 0);
    const averageScore = testResults.length > 0
      ? testResults.reduce((total, result) => total + result.score, 0) / testResults.length
      : 0;

    // Çalışma serisini hesapla
    const studyStreak = calculateStudyStreak(studySessions);

    // Son 7 günün ilerleme verilerini hesapla
    const weeklyProgress = calculateWeeklyProgress(testResults);

    res.json({
      totalStudyTime: Math.round(totalStudyTime),
      completedTopics,
      totalQuestions,
      averageScore: Math.round(averageScore),
      studyStreak,
      weeklyProgress
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Çalışma serisini hesaplar
 * @param   {array} sessions - Çalışma oturumları listesi
 * @returns {number} Kesintisiz çalışma günü sayısı
 */
const calculateStudyStreak = (sessions) => {
  if (!sessions.length) return 0;
  // Streak hesaplama mantığı...
  return 1; // Basit bir başlangıç değeri
};

/**
 * @desc    Haftalık ilerleme verilerini hesaplar
 * @param   {array} results - Test sonuçları listesi
 * @returns {array} Son 7 günün ilerleme verileri
 */
const calculateWeeklyProgress = (results) => {
  // Son 7 günün verilerini döndür
  return Array(7).fill(0).map(() => Math.floor(Math.random() * 100)); // Örnek veri
};

/**
 * @desc    Haftalık ilerleme detaylarını getirir
 * @route   GET /api/users/weekly-progress
 * @access  Private
 * @returns {object} Günlük ilerleme puanları ve gün etiketleri
 */
export const getWeeklyProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Pazartesi başlangıç
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Pazar bitiş

    // Haftalık çalışma oturumları
    const weeklyStudySessions = await StudySession.find({
      userId,
      createdAt: {
        $gte: weekStart,
        $lte: weekEnd
      }
    }).lean();

    // Haftalık test sonuçları
    const weeklyTestResults = await TestResult.find({
      userId,
      createdAt: {
        $gte: weekStart,
        $lte: weekEnd
      }
    }).lean();

    // Haftanın her günü için veri hesapla
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const dailyProgress = weekDays.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      
      // O günün çalışma oturumları
      const daySessions = weeklyStudySessions.filter(session => 
        format(new Date(session.createdAt), 'yyyy-MM-dd') === dayStr
      );
      
      // O günün test sonuçları
      const dayResults = weeklyTestResults.filter(result => 
        format(new Date(result.createdAt), 'yyyy-MM-dd') === dayStr
      );

      // Günlük toplam çalışma süresi (dakika)
      const totalStudyTime = daySessions.reduce((sum, session) => sum + (session.duration || 0), 0);
      
      // Günlük ortalama test skoru
      const avgTestScore = dayResults.length > 0
        ? dayResults.reduce((sum, result) => sum + (result.score || 0), 0) / dayResults.length
        : 0;

      // Günlük ilerleme puanı (çalışma süresi ve test skorlarının ağırlıklı ortalaması)
      const progressScore = (totalStudyTime / 60) * 0.7 + avgTestScore * 0.3;

      return Math.round(progressScore);
    });

    res.json({
      weeklyProgress: dailyProgress,
      labels: weekDays.map(day => format(day, 'EEEE', { locale: tr })) // Türkçe gün isimleri
    });

  } catch (error) {
    console.error('Weekly progress error:', error);
    res.status(400).json({ 
      message: 'Haftalık ilerleme verileri alınamadı', 
      error: error.message 
    });
  }
};