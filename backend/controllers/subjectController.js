import Subject from '../models/subjectModel.js';

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (subject) {
      res.json(subject);
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};