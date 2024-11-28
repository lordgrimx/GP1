import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { saveQuestion, getUserQuestions } from '../controllers/questionController.js';

const router = express.Router();

/**
 * @desc    Soru route'ları
 * @routes
 *   POST /api/questions - Yeni soru kaydet (Protected)
 *   GET /api/questions - Kullanıcının sorularını getir (Protected)
 */
router.post('/', protect, saveQuestion);
router.get('/', protect, getUserQuestions);

export default router; 