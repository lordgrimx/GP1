/**
 * @desc    Gerekli modüllerin içe aktarılması
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from "@google/generative-ai";
import userRoutes from './routes/userRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import testTrackRoutes from './routes/testTrackRoutes.js';
import studySessionRoutes from './routes/studySessionRoutes.js';
import testResultRoutes from './routes/testResultRoutes.js';
import questionRoutes from './routes/questionRoutes.js';

/**
 * @desc    Çevresel değişkenleri yükle
 */
dotenv.config();

/**
 * @desc    Express uygulamasını başlat ve temel middleware'leri yapılandır
 */
const app = express();
app.use(cors());

/**
 * @desc    Request body parser ayarları
 * @note    Büyük dosyalar için limit 10mb olarak ayarlandı
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * @desc    MongoDB bağlantısı
 * @note    Bağlantı başarılı/başarısız durumları console'a loglanır
 */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

/**
 * @desc    API route'larının tanımlanması
 * @note    Tüm route'lar /api prefix'i ile başlar
 * @routes
 *   /api/users - Kullanıcı işlemleri
 *   /api/subjects - Ders ve konu işlemleri
 *   /api/quizzes - Quiz işlemleri
 *   /api/testtrack - Deneme takip işlemleri
 *   /api/study-sessions - Çalışma oturumu işlemleri
 *   /api/test-results - Test sonuçları işlemleri
 *   /api/questions - Soru işlemleri
 */
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/testtrack', testTrackRoutes);
app.use('/api/study-sessions', studySessionRoutes);
app.use('/api/test-results', testResultRoutes);
app.use('/api/questions', questionRoutes);

/**
 * @desc    Sunucuyu başlat
 * @note    Port numarası env'den alınır, yoksa 5000 kullanılır
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
