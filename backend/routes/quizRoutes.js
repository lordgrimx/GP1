import express from 'express';
import { createQuiz, getQuizzes, getQuizById, submitQuizAttempt } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createQuiz);
router.get('/', protect, getQuizzes);
router.get('/:id', protect, getQuizById);
router.post('/:id/attempt', protect, submitQuizAttempt);

export default router;