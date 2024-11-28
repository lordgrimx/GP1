import asyncHandler from 'express-async-handler';
import TestTrack from '../models/testTrackModel.js';

// @desc    Deneme ekle
// @route   POST /api/testtrack
// @access  Private
const addTestTrack = asyncHandler(async (req, res) => {
  const { examName, examType, subjects, aytField, linkedExamId } = req.body;

  if (!examName || !examType) {
    res.status(400);
    throw new Error('Lütfen tüm gerekli alanları doldurun');
  }

  // AYT için alan kontrolü
  if (examType === 'AYT' && !aytField) {
    res.status(400);
    throw new Error('AYT için alan seçimi zorunludur');
  }

  const testTrack = await TestTrack.create({
    user: req.user._id,
    examName,
    examType,
    ...(aytField && { aytField }),
    subjects,
    ...(linkedExamId && { linkedExamId })
  });

  res.status(201).json(testTrack);
});

// @desc    Denemeleri getir
// @route   GET /api/testtrack
// @access  Private
const getTestTracks = asyncHandler(async (req, res) => {
  const testTracks = await TestTrack.find({ user: req.user._id })
    .populate('linkedExamId', 'examName examType examScore')
    .sort('-createdAt');
  res.json(testTracks);
});

// @desc    Deneme güncelle
// @route   PUT /api/testtrack/:id
// @access  Private
const updateTestTrack = asyncHandler(async (req, res) => {
  const { examName, examType, subjects, aytField, linkedExamId } = req.body;

  if (!examName || !examType) {
    res.status(400);
    throw new Error('Lütfen tüm gerekli alanları doldurun');
  }

  // AYT için alan kontrolü
  if (examType === 'AYT' && !aytField) {
    res.status(400);
    throw new Error('AYT için alan seçimi zorunludur');
  }

  const updateData = {
    examName,
    examType,
    ...(aytField && { aytField }),
    subjects,
    ...(linkedExamId && { linkedExamId })
  };

  const testTrack = await TestTrack.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json(testTrack);
});

// @desc    Deneme sil
// @route   DELETE /api/testtrack/:id
// @access  Private
const deleteTestTrack = asyncHandler(async (req, res) => {
  const testTrack = await TestTrack.findById(req.params.id);

  if (!testTrack) {
    res.status(404);
    throw new Error('Deneme bulunamadı');
  }

  if (testTrack.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Yetkisiz erişim');
  }

  // Bağlı denemenin bağlantısını temizle
  if (testTrack.linkedExamId) {
    await TestTrack.findByIdAndUpdate(testTrack.linkedExamId, {
      $unset: { linkedExamId: "" }
    });
  }

  // remove() yerine deleteOne() kullan
  await TestTrack.deleteOne({ _id: req.params.id });
  
  res.json({ message: 'Deneme silindi' });
});

// @desc    Bağlı denemeleri getir
// @route   GET /api/testtrack/linked
// @access  Private
const getLinkedTestTracks = asyncHandler(async (req, res) => {
  try {
    console.log('getLinkedTestTracks başlatıldı - Kullanıcı ID:', req.user._id);
    
    const tracks = await TestTrack.find({ user: req.user._id });
    console.log('Bulunan toplam deneme sayısı:', tracks.length);
    
    const linkedPairs = [];

    for (const track of tracks) {
      console.log('İşlenen deneme:', {
        id: track._id,
        examName: track.examName,
        examType: track.examType,
        examScore: track.examScore,
        linkedExamId: track.linkedExamId
      });

      if (track.linkedExamId) {
        const linkedExam = await TestTrack.findById(track.linkedExamId);
        console.log('Bağlı deneme bulundu:', {
          id: linkedExam?._id,
          examName: linkedExam?.examName,
          examType: linkedExam?.examType,
          examScore: linkedExam?.examScore
        });

        if (linkedExam && linkedExam.examType === 'TYT') {
          const finalScore = calculateFinalScore(linkedExam.examScore, track.examScore);
          console.log('Hesaplanan yerleştirme puanı:', {
            tytScore: linkedExam.examScore,
            aytScore: track.examScore,
            finalScore: finalScore
          });
          
          await TestTrack.findByIdAndUpdate(track._id, { finalScore });
          await TestTrack.findByIdAndUpdate(linkedExam._id, { finalScore });

          linkedPairs.push({
            exam1: linkedExam,
            exam2: track,
            finalScore
          });
        }
      }
    }

    console.log('Toplam bağlı deneme çifti sayısı:', linkedPairs.length);
    res.json(linkedPairs);
    
  } catch (error) {
    console.error('getLinkedTestTracks hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

// Yerleştirme puanı hesaplama yardımcı fonksiyonu
const calculateFinalScore = (score1, score2) => {
  if (!score1 || !score2) return null;
  return parseFloat((score1 * 0.4 + score2 * 0.6).toFixed(2));
};

export {
  getTestTracks,
  addTestTrack,
  updateTestTrack,
  deleteTestTrack,
  getLinkedTestTracks
}; 