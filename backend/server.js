import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from "@google/generative-ai";
import userRoutes from './routes/userRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import testTrackRoutes from './routes/testTrackRoutes.js';

dotenv.config();
const app = express();
app.use(cors());

// Body parser limitini artırıyoruz
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Gemini API'yi başlat
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Gemini endpoint'i
app.post('/api/gemini', async (req, res) => {
  try {
    const { image, prompt } = req.body;
    
    // Base64'ü binary'e çevir
    const imageBuffer = Buffer.from(image.split(',')[1], 'base64');

    // Gemini modeli için görüntüyü hazırla
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const generationConfig = {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 4096,
    };

    // Görüntüyü ve promptu birleştir
    const promptText = `${prompt}
    Lütfen bu sorunun çözümünü aşağıdaki formatta ver:
    1. Kullanılacak formüller (varsa)
    2. Çözüm adımları
    3. Sonuç
    
    Her adımı detaylı açıkla ve matematiksel işlemleri göster.`;

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: "image/jpeg"
      }
    };

    // Gemini'ye gönder
    const result = await model.generateContent([promptText, imagePart], generationConfig);
    const response = await result.response;
    const text = response.text();

    res.json({ answer: text });
  } catch (error) {
    console.error('Gemini API Hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// MongoDB bağlantısı ve diğer route'lar
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/testtrack', testTrackRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
