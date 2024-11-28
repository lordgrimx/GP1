import Question from '../models/questionModel.js';

/**
 * @desc    Yeni soru kaydeder
 * @route   POST /api/questions
 * @access  Private
 * @param   {string} imageData - Sorunun resim verisi (base64)
 * @param   {string} solution - Sorunun çözümü
 * @returns {object} Kaydedilen soru bilgileri
 * @details Kullanıcının yüklediği soru resmini ve çözümünü kaydeder
 */
export const saveQuestion = async (req, res) => {
  try {
    const { imageData, solution } = req.body;
    
    const question = await Question.create({
      user: req.user._id,
      imageData,
      solution
    });

    res.status(201).json(question);
  } catch (error) {
    console.error('Soru kaydetme hatası:', error);
    res.status(500).json({ message: 'Soru kaydedilemedi', error: error.message });
  }
};

/**
 * @desc    Kullanıcının tüm sorularını getirir
 * @route   GET /api/questions
 * @access  Private
 * @returns {array} Kullanıcının soru listesi
 * @details Kullanıcının kaydettiği tüm soruları oluşturulma 
 *          tarihine göre azalan sırada getirir
 */
export const getUserQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ user: req.user._id })
      .sort('-createdAt');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Sorular getirilemedi', error: error.message });
  }
}; 