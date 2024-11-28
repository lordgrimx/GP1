import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // dakika cinsinden
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'abandoned'],
    default: 'completed'
  }
});

export default mongoose.model('StudySession', studySessionSchema); 