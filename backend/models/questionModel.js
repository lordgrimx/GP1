import mongoose from 'mongoose';

/**
 * @desc    Soru şeması
 * @details Kullanıcıların kaydettiği soruların veritabanı modeli
 * 
 * @property {ObjectId} user - Soruyu kaydeden kullanıcının ID'si
 * @property {String} imageData - Soru resminin base64 formatında verisi
 * @property {String} solution - Sorunun çözümü/cevabı
 * @property {Date} createdAt - Sorunun kaydedilme tarihi
 */
const questionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageData: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Question = mongoose.model('Question', questionSchema);
export default Question; 