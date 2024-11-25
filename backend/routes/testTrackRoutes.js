import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addTestTrack, getTestTracks, updateTestTrack } from '../controllers/testTrackController.js';

const router = express.Router();

router.post('/', protect, addTestTrack);
router.get('/', protect, getTestTracks);
router.put('/:id', protect, updateTestTrack);

export default router; 