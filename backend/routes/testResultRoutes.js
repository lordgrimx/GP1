import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  addTestResult, 
  getUserTestResults 
} from '../controllers/testResultController.js';

const router = express.Router();

/**
 * @desc    Test sonuçları route'ları
 * @routes
 *   POST /api/testresults - Yeni test sonucu ekle (Protected)
 *   GET /api/testresults - Kullanıcının test sonuçlarını getir (Protected)
 */
router.post('/', protect, addTestResult);
router.get('/', protect, getUserTestResults);

export default router; 