import mongoose from 'mongoose';

/**
 * @desc    Quiz şeması
 * @details Sistemdeki quizlerin veritabanı modeli
 * 
 * @property {String} title - Quiz başlığı
 * @property {Array} questions - Quiz soruları
 * @property {String} questions.question - Soru metni
 * @property {Array} questions.options - Şık seçenekleri
 * @property {Number} questions.correctAnswer - Doğru cevabın indeksi
 * @property {Date} createdAt - Oluşturulma tarihi (timestamps)
 * @property {Date} updatedAt - Güncellenme tarihi (timestamps)
 */
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true }
  }]
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;