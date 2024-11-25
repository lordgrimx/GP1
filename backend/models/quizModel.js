import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true }
  }]
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;