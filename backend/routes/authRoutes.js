import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Mount registration and authentication controller entry paths
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
