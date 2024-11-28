import express from 'express';
import { protect, uploadMiddleware } from '../middleware/authMiddleware.js';
import { 
    registerUser, 
    loginUser, 
    getUserProfile,
    updateUserProfile,
    getWeeklyProgress,
    getUserIntelligence,
    checkUserExists,
    updateUserProfilePhoto
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/weekly-progress', protect, getWeeklyProgress);
router.get('/intelligence', protect, getUserIntelligence);
router.post('/check-user', checkUserExists);
router.put('/profile-photo', protect, uploadMiddleware.single('profileImage'), updateUserProfilePhoto);

export default router;
