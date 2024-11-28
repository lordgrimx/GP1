import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import defaultPP from '../defaultPP.json' assert { type: 'json' };

/**
 * @desc    Kullanıcı şeması
 * @details Sistemdeki kullanıcıların veritabanı modeli
 * 
 * @property {String} username - Benzersiz kullanıcı adı
 * @property {String} email - Benzersiz e-posta adresi
 * @property {String} password - Şifrelenmiş kullanıcı şifresi
 * @property {String} profileImage - Profil fotoğrafı URL'si
 * @property {Object} typeOfIntelligence - Kullanıcının zeka türü bilgileri
 * @property {Date} createdAt - Hesap oluşturulma tarihi
 * @property {Date} updatedAt - Son güncelleme tarihi
 * 
 * @method matchPassword - Girilen şifreyi kontrol eder
 * @hook pre-save - Şifre değiştiğinde otomatik şifreleme yapar
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: null,
    maxLength: 5242880 // 5MB
  },
  typeOfIntelligence: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.updatedAt = Date.now();
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
