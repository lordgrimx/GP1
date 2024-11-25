import express from 'express';
import { getSubjects, getSubjectById } from '../controllers/subjectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getSubjects);
router.get('/:id', protect, getSubjectById);

export default router;