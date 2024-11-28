import express from 'express';
import { createQuiz, getQuizzes, getQuizById, submitQuizAttempt } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @desc    Quiz route'ları
 * @routes
 *   POST /api/quizzes - Yeni quiz oluştur (Protected)
 *   GET /api/quizzes - Tüm quizleri getir (Protected)
 *   GET /api/quizzes/:id - Belirli bir quizi getir (Protected)
 *   POST /api/quizzes/:id/attempt - Quiz denemesi gönder (Protected)
 */
router.post('/', protect, createQuiz);
router.get('/', protect, getQuizzes);
router.get('/:id', protect, getQuizById);
router.post('/:id/attempt', protect, submitQuizAttempt);

export default router;