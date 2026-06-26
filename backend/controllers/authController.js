import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Utility helper function to generate signed JWT tokens valid for 30 days
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user account with complete field validations (Page 11 Requirement)
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { username, email, password, avatar } = req.body;

  try {
    // 1. Basic validation check for empty strings or fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide a username, email, and password' });
    }

    // 2. Validate password length requirements (e.g., minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar: avatar || ''
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }

  } catch (error) {
    return res.status(500).json({ message: 'Server registration error', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password details' });
    }

    // Locate the matching user email record
    const user = await User.findOne({ email });

    // Compare plain-text password inputs with the stored securely hashed password string
    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    } else {
      return res.status(401).json({ message: 'Invalid email address or password credentials' });
    }

  } catch (error) {
    return res.status(500).json({ message: 'Server login error', error: error.message });
  }
};
