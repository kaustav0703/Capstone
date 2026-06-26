import express from 'express';
import { 
  getCommentsByVideo, 
  addComment, 
  updateComment, 
  deleteComment 
} from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public open-access reading loop endpoint
router.get('/:videoId', getCommentsByVideo);

// Private operations requiring active user logins validation checks
router.post('/', protect, addComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

export default router;
