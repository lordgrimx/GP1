import StudySession from '../models/studySession.js';

/**
 * @desc    Yeni çalışma oturumu oluşturur
 * @route   POST /api/studysessions
 * @access  Private
 * @param   {string} topicId - Çalışılan konunun ID'si
 * @param   {number} duration - Çalışma süresi (dakika)
 * @param   {string} status - Oturum durumu (completed/interrupted)
 * @returns {object} Oluşturulan çalışma oturumu bilgileri
 */
export const createStudySession = async (req, res) => {
  try {
    const { topicId, duration, status } = req.body;
    const session = await StudySession.create({
      userId: req.user._id,
      topicId,
      duration,
      status
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: 'Çalışma oturumu oluşturulamadı' });
  }
};

/**
 * @desc    Kullanıcının tüm çalışma oturumlarını getirir
 * @route   GET /api/studysessions
 * @access  Private
 * @returns {array} Çalışma oturumları listesi
 * @details Oturumlar oluşturulma tarihine göre azalan sırada sıralanır
 *          ve konu bilgileri populate edilir
 */
export const getUserStudySessions = async (req, res) => {
  try {
    const sessions = await StudySession.find({ userId: req.user._id })
      .populate('topicId', 'Lesson')
      .sort('-createdAt');
    res.json(sessions);
  } catch (error) {
    res.status(400).json({ message: 'Çalışma oturumları getirilemedi' });
  }
}; 