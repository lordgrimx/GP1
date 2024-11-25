import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  Lesson: { type: String, required: true },
  questionNumber: { type: Number, required: true },
  subjects: {
    type: Map,
    of: String
  }
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;