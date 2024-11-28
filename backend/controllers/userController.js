import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import path from 'path';
import fs from 'fs';
import defaultPP from '../defaultPP.json' assert { type: 'json' };
import StudySession from '../models/studySession.js';
import TestResult from '../models/testResult.js';
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Kullanıcı kaydı
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

// Kullanıcı girişi
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

// Kullanıcı profilini getirme
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

// Kullanıcı şifresini güncelleme
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

// Kullanıcı profil fotoğrafını güncelleme
export const updateUserProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (req.file) {
      const base64Image = fs.readFileSync(req.file.path).toString('base64'); // Dosyayı Base64 formatına çevir
      user.profileImage = `data:${req.file.mimetype};base64,${base64Image}`; // Base64 formatında kaydet
      await user.save();
      res.json({ message: 'Profil fotoğrafı başarıyla güncellendi', profileImage: user.profileImage });
    } else {
      res.status(400).json({ message: 'Dosya yüklenmedi' });
    }
  } catch (error) {
    console.error('Profil fotoğrafı güncellenirken hata oluştu:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kullanıcı profilini güncelleme (genel bilgi)
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

// Kullanıcının zeka türlerini getirme
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

// Yardımcı fonksiyonlar
const calculateStudyStreak = (sessions) => {
  if (!sessions.length) return 0;
  // Streak hesaplama mantığı...
  return 1; // Basit bir başlangıç değeri
};

const calculateWeeklyProgress = (results) => {
  // Son 7 günün verilerini döndür
  return Array(7).fill(0).map(() => Math.floor(Math.random() * 100)); // Örnek veri
};

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