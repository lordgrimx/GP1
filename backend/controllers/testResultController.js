import TestResult from '../models/testResult.js';

/**
 * @desc    Yeni test sonucu ekler
 * @route   POST /api/testresults
 * @access  Private
 * @param   {string} subjectId - Test konusunun ID'si
 * @param   {number} questionCount - Toplam soru sayısı
 * @param   {number} correctAnswers - Doğru cevap sayısı
 * @param   {number} wrongAnswers - Yanlış cevap sayısı
 * @param   {number} score - Test puanı
 * @returns {object} Oluşturulan test sonucu bilgileri
 */
export const addTestResult = async (req, res) => {
  try {
    const { subjectId, questionCount, correctAnswers, wrongAnswers, score } = req.body;
    const result = await TestResult.create({
      userId: req.user._id,
      subjectId,
      questionCount,
      correctAnswers,
      wrongAnswers,
      score
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: 'Test sonucu eklenemedi' });
  }
};

/**
 * @desc    Kullanıcının tüm test sonuçlarını getirir
 * @route   GET /api/testresults
 * @access  Private
 * @returns {array} Test sonuçları listesi (konu bilgileri dahil)
 * @details Sonuçlar oluşturulma tarihine göre azalan sırada sıralanır
 *          ve konu bilgileri populate edilir
 */
export const getUserTestResults = async (req, res) => {
  try {
    const results = await TestResult.find({ userId: req.user._id })
      .populate('subjectId', 'Lesson')
      .sort('-createdAt');
    res.json(results);
  } catch (error) {
    res.status(400).json({ message: 'Test sonuçları getirilemedi' });
  }
}; 