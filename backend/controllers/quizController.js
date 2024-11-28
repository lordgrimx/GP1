import Quiz from '../models/quizModel.js';
import QuizAttempt from '../models/quizAttemptModel.js';

/**
 * @desc    Yeni quiz oluşturur
 * @route   POST /api/quizzes
 * @access  Private
 * @param   {string} title - Quiz başlığı
 * @param   {array} questions - Quiz soruları listesi
 * @returns {object} Oluşturulan quiz bilgileri
 */
export const createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const quiz = await Quiz.create({ title, questions });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create quiz' });
  }
};

/**
 * @desc    Tüm quizleri getirir
 * @route   GET /api/quizzes
 * @access  Public
 * @returns {array} Quizlerin listesi
 */
export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({});
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Belirli bir quizi ID'ye göre getirir
 * @route   GET /api/quizzes/:id
 * @access  Public
 * @param   {string} id - Quiz ID'si
 * @returns {object} Quiz detayları
 */
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Quiz denemesi sonucunu kaydeder
 * @route   POST /api/quizzes/:id/submit
 * @access  Private
 * @param   {string} id - Quiz ID'si
 * @param   {array} answers - Kullanıcının cevapları
 * @returns {object} Quiz denemesi sonuçları
 * @details Kullanıcının cevaplarını kontrol eder, 
 *          skor hesaplar ve sonucu kaydeder
 */
export const submitQuizAttempt = async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score++;
      }
    });

    const attempt = await QuizAttempt.create({
      user: req.user._id,
      quiz: quiz._id,
      score,
      answers
    });

    res.status(201).json(attempt);
  } catch (error) {
    res.status(400).json({ message: 'Failed to submit quiz attempt' });
  }
};