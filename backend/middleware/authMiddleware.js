import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import multer from 'multer';

// Multer konfigürasyonu
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Sadece resim dosyaları yüklenebilir.'), false);
        }
    }
});

/**
 * @desc    JWT token kontrolü yapan middleware
 * @param   {Object} req - Express request nesnesi
 * @param   {Object} res - Express response nesnesi
 * @param   {Function} next - Sonraki middleware'e geçiş fonksiyonu
 * @returns {void}
 */
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};