import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  addTestResult, 
  getUserTestResults 
} from '../controllers/testResultController.js';

const router = express.Router();

router.post('/', protect, addTestResult);
router.get('/', protect, getUserTestResults);

export default router; 