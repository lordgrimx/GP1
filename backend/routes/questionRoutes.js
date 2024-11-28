import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { saveQuestion, getUserQuestions } from '../controllers/questionController.js';

const router = express.Router();

router.post('/', protect, saveQuestion);
router.get('/', protect, getUserQuestions);

export default router; 