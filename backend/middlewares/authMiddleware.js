import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Check for token in the Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header string "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify the token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database excluding the hashed password string, and attach to request object
      req.user = await User.findById(decoded.id).select('-password');
      
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, missing security token' });
  }
};
