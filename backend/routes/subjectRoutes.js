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

/**
 * @desc    Ders ve konu route'ları
 * @routes
 *   GET /api/subjects - Tüm dersleri getir (Protected)
 *   POST /api/subjects - Yeni ders ekle (Protected)
 *   GET /api/subjects/names - Ders adlarını getir (Protected)
 *   GET /api/subjects/tyt - TYT derslerini getir (Protected)
 *   GET /api/subjects/ayt - AYT derslerini getir (Protected)
 *   GET /api/subjects/:id - Belirli bir dersi getir (Protected)
 *   PUT /api/subjects/:id - Ders güncelle (Protected)
 *   DELETE /api/subjects/:id - Ders sil (Protected)
 *   POST /api/subjects/:id/proficiency - Konu yeterliliği güncelle (Protected)
 * @note    Tüm route'lar protect middleware'i ile korunmaktadır
 */
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
