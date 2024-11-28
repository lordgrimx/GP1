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

/**
 * @desc    Deneme sınavı takip route'ları
 * @routes
 *   GET /api/testtrack/linked - Bağlantılı denemeleri getir (Protected)
 *   GET /api/testtrack - Tüm denemeleri getir (Protected)
 *   POST /api/testtrack - Yeni deneme ekle (Protected)
 *   PUT /api/testtrack/:id - Deneme güncelle (Protected)
 *   DELETE /api/testtrack/:id - Deneme sil (Protected)
 */
router.get('/linked', protect, getLinkedTestTracks);

router.route('/')
  .get(protect, getTestTracks)
  .post(protect, addTestTrack);

router.route('/:id')
  .put(protect, updateTestTrack)
  .delete(protect, deleteTestTrack);

export default router; 