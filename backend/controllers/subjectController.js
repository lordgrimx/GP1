import Subject from '../models/subjectModel.js';

// Tüm dersleri getir
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Belirli bir dersi ID ile getir
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (subject) {
      res.json(subject);
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    console.error('Error fetching subject by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Yeni bir ders ekle
export const addSubject = async (req, res) => {
  const { lesson, questionNumber, subjects } = req.body;

  try {
    const newSubject = new Subject({
      lesson,
      questionNumber,
      subjects,
    });

    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (error) {
    console.error('Error adding subject:', error);
    res.status(400).json({ message: 'Failed to add subject' });
  }
};

// Belirli bir dersi güncelle
export const updateSubject = async (req, res) => {
  const { lesson, questionNumber, subjects } = req.body;

  try {
    const subject = await Subject.findById(req.params.id);

    if (subject) {
      subject.lesson = lesson || subject.lesson;
      subject.questionNumber = questionNumber || subject.questionNumber;
      subject.subjects = subjects || subject.subjects;

      const updatedSubject = await subject.save();
      res.json(updatedSubject);
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(400).json({ message: 'Failed to update subject' });
  }
};

// Belirli bir dersi sil
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (subject) {
      await subject.remove();
      res.json({ message: 'Subject removed' });
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Ders adlarını getir
export const getSubjectNames = async (req, res) => {
  try {
    const subjects = await Subject.find({}).select('Lesson -_id');
    console.log(subjects)
    const subjectNames = subjects.map(subject => subject.Lesson);
    console.log(subjectNames)
    res.json(subjectNames);
  } catch (error) {
    console.error('Error fetching subject names:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


