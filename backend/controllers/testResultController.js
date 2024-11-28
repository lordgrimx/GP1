import TestResult from '../models/testResult.js';

// Test sonucu ekle
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

// Kullanıcının test sonuçlarını getir
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