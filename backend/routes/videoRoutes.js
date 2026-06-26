import express from 'express';
import { 
  getAllVideos, 
  getVideoById, 
  createVideo, 
  likeVideo, 
  dislikeVideo 
} from '../controllers/videoController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public open-access routes
router.get('/', getAllVideos);
router.get('/:id', getVideoById);

// Protected token guarded route entry endpoints
router.post('/', protect, createVideo);
router.put('/:id/like', protect, likeVideo);
router.put('/:id/dislike', protect, dislikeVideo);

export default router;
