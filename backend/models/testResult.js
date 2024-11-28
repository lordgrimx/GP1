import mongoose from 'mongoose';

/**
 * @desc    Test sonucu şeması
 * @details Kullanıcıların test sonuçlarının veritabanı modeli
 * 
 * @property {ObjectId} userId - Testi çözen kullanıcının ID'si
 * @property {ObjectId} subjectId - Test konusunun ID'si
 * @property {Date} date - Test tarihi
 * @property {Number} questionCount - Toplam soru sayısı
 * @property {Number} correctAnswers - Doğru cevap sayısı
 * @property {Number} wrongAnswers - Yanlış cevap sayısı
 * @property {Number} score - Test puanı
 */
const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  questionCount: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  wrongAnswers: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
});

export default mongoose.model('TestResult', testResultSchema); 