import Question from '../models/questionModel.js';

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

export const getUserQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ user: req.user._id })
      .sort('-createdAt');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Sorular getirilemedi', error: error.message });
  }
}; 