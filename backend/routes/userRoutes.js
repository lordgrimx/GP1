import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserPassword, updateUserProfilePhoto } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/password', protect, updateUserPassword);
router.put('/profile/photo', protect, upload.single('profileImage'), updateUserProfilePhoto);

export default router;
