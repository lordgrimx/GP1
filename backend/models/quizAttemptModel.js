import mongoose from 'mongoose';

/**
 * @desc    Quiz deneme şeması
 * @details Kullanıcıların quiz denemelerinin veritabanı modeli
 * 
 * @property {ObjectId} user - Quizi çözen kullanıcının ID'si
 * @property {ObjectId} quiz - Çözülen quizin ID'si
 * @property {Number} score - Alınan puan
 * @property {Array<Number>} answers - Verilen cevapların listesi
 * @property {Date} createdAt - Oluşturulma tarihi (timestamps)
 * @property {Date} updatedAt - Güncellenme tarihi (timestamps)
 */
const quizAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  answers: [{ type: Number, required: true }]
}, { timestamps: true });

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

export default QuizAttempt;