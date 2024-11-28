import asyncHandler from 'express-async-handler';
import TestTrack from '../models/testTrackModel.js';

/**
 * @desc    Yeni deneme sınavı kaydı oluşturur
 * @route   POST /api/testtrack
 * @access  Private
 * @param   {string} examName - Deneme sınavı adı
 * @param   {string} examType - Sınav türü (TYT/AYT)
 * @param   {array} subjects - Sınav konuları
 * @param   {string} aytField - AYT alan türü (Sayısal/Eşit Ağırlık/Sözel)
 * @param   {string} linkedExamId - Bağlantılı sınav ID'si (opsiyonel)
 * @returns {object} Oluşturulan deneme sınavı bilgileri
 */
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

/**
 * @desc    Kullanıcının tüm deneme sınavlarını getirir
 * @route   GET /api/testtrack
 * @access  Private
 * @returns {array} Deneme sınavları listesi (bağlantılı sınavlar dahil)
 */
const getTestTracks = asyncHandler(async (req, res) => {
  const testTracks = await TestTrack.find({ user: req.user._id })
    .populate('linkedExamId', 'examName examType examScore')
    .sort('-createdAt');
  res.json(testTracks);
});

/**
 * @desc    Mevcut deneme sınavını günceller
 * @route   PUT /api/testtrack/:id
 * @access  Private
 * @param   {string} id - Güncellenecek deneme sınavı ID'si
 * @param   {string} examName - Yeni sınav adı
 * @param   {string} examType - Yeni sınav türü
 * @param   {array} subjects - Yeni sınav konuları
 * @param   {string} aytField - Yeni AYT alan türü
 * @param   {string} linkedExamId - Yeni bağlantılı sınav ID'si
 * @returns {object} Güncellenmiş deneme sınavı bilgileri
 */
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

/**
 * @desc    Deneme sınavını siler
 * @route   DELETE /api/testtrack/:id
 * @access  Private
 * @param   {string} id - Silinecek deneme sınavı ID'si
 * @returns {object} Silme işlemi onay mesajı
 */
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

/**
 * @desc    Bağlantılı deneme sınavlarını getirir ve yerleştirme puanlarını hesaplar
 * @route   GET /api/testtrack/linked
 * @access  Private
 * @returns {array} Bağlantılı sınav çiftleri ve yerleştirme puanları
 * @details TYT ve AYT sınavlarını eşleştirir ve yerleştirme puanını hesaplar
 *          TYT puanı %40, AYT puanı %60 ağırlığında hesaplanır
 */
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

/**
 * @desc    Yerleştirme puanını hesaplar
 * @param   {number} score1 - TYT puanı
 * @param   {number} score2 - AYT puanı
 * @returns {number|null} Hesaplanan yerleştirme puanı veya null
 * @details TYT puanının %40'ı ve AYT puanının %60'ı alınarak hesaplanır
 */
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