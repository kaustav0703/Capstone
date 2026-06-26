import express from 'express';
import { getChannelById, createChannel, getMyChannel } from '../controllers/channelController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Private dashboard routes requiring active tokens
router.get('/user/me', protect, getMyChannel);
router.post('/', protect, createChannel);

// Public lookup viewing profile route
router.get('/:id', getChannelById);

export default router;
