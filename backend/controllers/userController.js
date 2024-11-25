import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import path from 'path';
import fs from 'fs';
import defaultPP from '../defaultPP.json' assert { type: 'json' };

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
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        typeofintelligence: user.typeOfIntelligence,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error });
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
      const base64Image = fs.readFileSync(req.file.path).toString('base64');
      user.profileImage = `data:${req.file.mimetype};base64,${base64Image}`;
      await user.save();
      fs.unlinkSync(req.file.path);
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
