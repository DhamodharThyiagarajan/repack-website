import express from 'express';
import Comment from '../models/Comment.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get comments for a repack
router.get('/repack/:repackId', async (req, res) => {
  try {
    const comments = await Comment.find({ repackId: req.params.repackId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post a comment
router.post('/', protect, async (req, res) => {
  const { repackId, content } = req.body;

  if (!content || !repackId) {
    return res.status(400).json({ message: 'Repack ID and content are required' });
  }

  try {
    const comment = await Comment.create({
      repackId,
      userId: req.user._id,
      username: req.user.username,
      content,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
