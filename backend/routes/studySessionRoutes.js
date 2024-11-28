import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  createStudySession, 
  getUserStudySessions 
} from '../controllers/studySessionController.js';

const router = express.Router();

/**
 * @desc    Çalışma oturumu route'ları
 * @routes
 *   POST /api/studysessions - Yeni çalışma oturumu oluştur (Protected)
 *   GET /api/studysessions - Kullanıcının çalışma oturumlarını getir (Protected)
 */
router.post('/', protect, createStudySession);
router.get('/', protect, getUserStudySessions);

export default router; 