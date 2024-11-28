import express from 'express';
import {
  getSubjects,
  getSubjectById,
  addSubject,
  updateSubject,
  deleteSubject,
  getSubjectNames,
  getTYTSubjects,
  getAYTSubjects,
  updateSubjectProficiency
} from '../controllers/subjectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tüm route'ları protect middleware'i ile koruyalım
router.use(protect);

// Artık her route korunuyor
router.route('/')
  .get(getSubjects)
  .post(addSubject);

router.get('/names', getSubjectNames);
router.get('/tyt', getTYTSubjects);
router.get('/ayt', getAYTSubjects);

router.route('/:id')
  .get(getSubjectById)
  .put(updateSubject)
  .delete(deleteSubject);

router.post('/:id/proficiency', updateSubjectProficiency);

export default router;
