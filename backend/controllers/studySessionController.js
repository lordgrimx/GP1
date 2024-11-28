import StudySession from '../models/studySession.js';

// Çalışma oturumu oluştur
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

// Kullanıcının çalışma oturumlarını getir
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