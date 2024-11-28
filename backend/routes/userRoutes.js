import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
    registerUser, 
    loginUser, 
    getUserProfile,
    updateUserProfile,
    getWeeklyProgress,
    getUserIntelligence
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/weekly-progress', protect, getWeeklyProgress);
router.get('/intelligence', protect, getUserIntelligence);

export default router;
