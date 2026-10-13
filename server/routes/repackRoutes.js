import express from 'express';
import Repack from '../models/Repack.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all repacks with search/filter/pagination
router.get('/', async (req, res) => {
  try {
    const pageSize = parseInt(req.query.pageSize) || 10;
    const page = parseInt(req.query.page) || 1;

    const searchKeyword = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { developer: { $regex: req.query.keyword, $options: 'i' } },
            { publisher: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const genreFilter = req.query.genre
      ? { genres: { $regex: req.query.genre, $options: 'i' } }
      : {};

    const filter = { ...searchKeyword, ...genreFilter };

    const count = await Repack.countDocuments(filter);
    const repacks = await Repack.find(filter)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ repacks, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single repack & increment views
router.get('/:id', async (req, res) => {
  try {
    const repack = await Repack.findById(req.params.id);
    if (repack) {
      repack.views = (repack.views || 0) + 1;
      await repack.save();
      res.json(repack);
    } else {
      res.status(404).json({ message: 'Repack not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a repack (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const repack = new Repack(req.body);
    const createdRepack = await repack.save();
    res.status(201).json(createdRepack);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a repack (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const repack = await Repack.findById(req.params.id);
    if (repack) {
      Object.assign(repack, req.body);
      const updatedRepack = await repack.save();
      res.json(updatedRepack);
    } else {
      res.status(404).json({ message: 'Repack not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete repack (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const repack = await Repack.findById(req.params.id);
    if (repack) {
      await repack.deleteOne();
      res.json({ message: 'Repack removed' });
    } else {
      res.status(404).json({ message: 'Repack not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
