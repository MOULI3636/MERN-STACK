const express = require('express');
const router = express.Router();
const Confession = require('../models/Confession');
const User = require('../models/User');

// Create confession
router.post('/', async (req, res) => {
  try {
    const { text, subject, secretCode, category, userId } = req.body;
    
    if (secretCode.length < 4) {
      return res.status(400).json({ error: 'Secret code must be 4+ characters' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const confession = new Confession({
      text,
      subject,
      secretCode,
      category,
      userId,
      anonymousId: user.anonymousId || 'Anonymous' + Math.floor(1000 + Math.random() * 9000)
    });
    
    await confession.save();
    
    user.totalConfessions = (user.totalConfessions || 0) + 1;
    await user.save();
    
    // Populate user data
    await confession.populate('userId', 'name anonymousId');
    
    res.status(201).json(confession);
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all confessions
router.get('/', async (req, res) => {
  try {
    const confessions = await Confession.find()
      .populate('userId', 'name anonymousId')
      .sort({ createdAt: -1 });
    res.json(confessions);
  } catch (error) {
    console.error('Get error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add reaction
router.post('/:id/react', async (req, res) => {
  try {
    const { reactionType } = req.body;
    
    const confession = await Confession.findById(req.params.id);
    
    if (!confession) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    if (reactionType in confession.reactions) {
      confession.reactions[reactionType] += 1;
      await confession.save();
    }
    
    res.json(confession);
  } catch (error) {
    console.error('Reaction error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get category stats
router.get('/stats/categories', async (req, res) => {
  try {
    const stats = await Confession.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
