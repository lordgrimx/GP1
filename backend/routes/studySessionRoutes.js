import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  createStudySession, 
  getUserStudySessions 
} from '../controllers/studySessionController.js';

const router = express.Router();

router.post('/', protect, createStudySession);
router.get('/', protect, getUserStudySessions);

export default router; 