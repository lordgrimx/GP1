import express from 'express';
import {
  getSubjects,
  getSubjectById,
  addSubject,
  updateSubject,
  deleteSubject,
  getSubjectNames,
} from '../controllers/subjectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getSubjects); // Tüm dersleri getir
router.post('/', protect, addSubject); // Yeni ders ekle
router.get('/names', protect, getSubjectNames);// Sadece ders adlarını getir
router.get('/:id', protect, getSubjectById); // Belirli bir dersi ID ile getir
router.put('/:id', protect, updateSubject); // Belirli bir dersi güncelle
router.delete('/:id', protect, deleteSubject); // Belirli bir dersi sil
 

export default router;
