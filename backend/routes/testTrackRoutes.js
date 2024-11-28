import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getTestTracks,
  addTestTrack,
  updateTestTrack,
  deleteTestTrack,
  getLinkedTestTracks
} from '../controllers/testTrackController.js';

const router = express.Router();

router.get('/linked', protect, getLinkedTestTracks);

router.route('/')
  .get(protect, getTestTracks)
  .post(protect, addTestTrack);

router.route('/:id')
  .put(protect, updateTestTrack)
  .delete(protect, deleteTestTrack);

export default router; 