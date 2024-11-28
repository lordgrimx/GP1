import Subject from '../models/subjectModel.js';

/**
 * @desc    Tüm dersleri getirir
 * @route   GET /api/subjects
 * @access  Public
 * @returns {array} Tüm derslerin listesi
 */
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Belirli bir dersi ID'ye göre getirir
 * @route   GET /api/subjects/:id
 * @access  Public
 * @param   {string} id - Ders ID'si
 * @returns {object} Ders detayları
 */
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

/**
 * @desc    Yeni bir ders ekler
 * @route   POST /api/subjects
 * @access  Private
 * @param   {string} lesson - Ders adı
 * @param   {number} questionNumber - Soru sayısı
 * @param   {array} subjects - Alt konular listesi
 * @returns {object} Oluşturulan ders bilgileri
 */
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

/**
 * @desc    Mevcut bir dersi günceller
 * @route   PUT /api/subjects/:id
 * @access  Private
 * @param   {string} id - Güncellenecek ders ID'si
 * @param   {string} lesson - Yeni ders adı
 * @param   {number} questionNumber - Yeni soru sayısı
 * @param   {array} subjects - Yeni alt konular listesi
 * @returns {object} Güncellenmiş ders bilgileri
 */
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

/**
 * @desc    Bir dersi siler
 * @route   DELETE /api/subjects/:id
 * @access  Private
 * @param   {string} id - Silinecek ders ID'si
 * @returns {object} Silme işlemi onay mesajı
 */
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

/**
 * @desc    Tüm ders adlarını getirir
 * @route   GET /api/subjects/names
 * @access  Public
 * @returns {array} Ders adları listesi
 */
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

/**
 * @desc    TYT derslerini getirir
 * @route   GET /api/subjects/tyt
 * @access  Public
 * @returns {array} TYT dersleri listesi
 * @details Ders adı "TYT" ile başlayan dersleri filtreler
 */
export const getTYTSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({
      Lesson: { $regex: '^TYT', $options: 'i' }
    }).select('Lesson questionNumber subjects');
    
    if (!subjects || subjects.length === 0) {
      return res.status(404).json({ message: 'TYT dersleri bulunamadı' });
    }
    
    res.json(subjects);
  } catch (error) {
    console.error('TYT dersleri getirilirken hata:', error);
    res.status(500).json({ 
      message: 'TYT dersleri alınırken bir hata oluştu', 
      error: error.message 
    });
  }
};

/**
 * @desc    AYT derslerini getirir
 * @route   GET /api/subjects/ayt
 * @access  Public
 * @returns {array} AYT dersleri listesi
 * @details Ders adı "AYT" ile başlayan dersleri filtreler
 */
export const getAYTSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({
      Lesson: { $regex: '^AYT', $options: 'i' }
    }).select('Lesson questionNumber subjects');
    
    if (!subjects || subjects.length === 0) {
      return res.status(404).json({ message: 'AYT dersleri bulunamadı' });
    }
    
    res.json(subjects);
  } catch (error) {
    console.error('AYT dersleri getirilirken hata:', error);
    res.status(500).json({ 
      message: 'AYT dersleri alınırken bir hata oluştu', 
      error: error.message 
    });
  }
};

/**
 * @desc    Bir konunun yeterlilik seviyesini günceller
 * @route   PUT /api/subjects/:id/proficiency
 * @access  Private
 * @param   {string} id - Ders ID'si
 * @param   {string} topicName - Konu adı
 * @param   {number} level - Yeterlilik seviyesi
 * @returns {object} Güncelleme durumu ve yeni seviye bilgisi
 */
export const updateSubjectProficiency = async (req, res) => {
  try {
    const { topicName, level } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Konu bulunamadı' });
    }

    // Eğer proficiencyLevels henüz oluşturulmadıysa, yeni bir Map oluştur
    if (!subject.proficiencyLevels) {
      subject.proficiencyLevels = new Map();
    }

    // Proficiency seviyesini güncelle
    subject.proficiencyLevels.set(topicName, level);
    
    // Değişiklikleri kaydet
    await subject.save();

    res.json({ 
      message: 'Seviye başarıyla güncellendi',
      level: level,
      topicName: topicName
    });
  } catch (error) {
    console.error('Seviye güncellenirken hata:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};


