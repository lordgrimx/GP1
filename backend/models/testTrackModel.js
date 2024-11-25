import mongoose from 'mongoose';

const testTrackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  examName: {
    type: String,
    required: true,
  },
  examType: {
    type: String,
    required: true,
  },
  subjects: {
    type: Map,
    of: {
      correct: { type: Number, default: 0 },
      incorrect: { type: Number, default: 0 },
      empty: { type: Number, default: 0 },
    },
  },
}, { timestamps: true });

const TestTrack = mongoose.model('TestTrack', testTrackSchema);

export default TestTrack; 