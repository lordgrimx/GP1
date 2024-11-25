import TestTrack from '../models/testTrackModel.js';

export const addTestTrack = async (req, res) => {
  const { examName, examType, subjects } = req.body;

  try {
    const testTrack = new TestTrack({
      user: req.user._id,
      examName,
      examType,
      subjects,
    });

    await testTrack.save();
    res.status(201).json(testTrack);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add test track', error });
  }
};

export const getTestTracks = async (req, res) => {
  try {
    const testTracks = await TestTrack.find({ user: req.user._id });
    res.json(testTracks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTestTrack = async (req, res) => {
  const { examName, examType, subjects } = req.body;

  try {
    const testTrack = await TestTrack.findById(req.params.id);
    if (!testTrack) {
      return res.status(404).json({ message: 'Test track not found' });
    }

    testTrack.examName = examName || testTrack.examName;
    testTrack.examType = examType || testTrack.examType;
    testTrack.subjects = subjects || testTrack.subjects;

    await testTrack.save();
    res.json(testTrack);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update test track', error });
  }
}; 