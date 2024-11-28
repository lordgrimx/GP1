import jwt from 'jsonwebtoken';

/**
 * @desc    JWT token oluşturur
 * @param   {string} id - Kullanıcı ID'si
 * @returns {string} JWT token
 * @details
 *   - process.env.JWT_SECRET kullanarak token oluşturur
 *   - Token 30 gün geçerlidir
 *   - Token içinde sadece kullanıcı ID'si saklanır
 *   - Token kimlik doğrulama için kullanılır
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;