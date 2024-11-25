import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import testTrackRoutes from './routes/testTrackRoutes.js';

dotenv.config();

const app = express();

app.use(cors());

// Body parser limitini artırıyoruz
app.use(express.json({ limit: '10mb' })); // JSON verisi için 10 MB sınırı
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/testtrack', testTrackRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
