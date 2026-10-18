const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const me = await User.findById(req.user.id);
  if (!me) return res.status(404).json({ message: 'User not found' });

  const candidates = await User.find({ _id: { $ne: me._id } }).select('-passwordHash');
  const scored = candidates.map(candidate => ({ user: candidate, score: (candidate.interests || []).filter(i => (me.interests || []).includes(i)).length }));
  scored.sort((a, b) => b.score - a.score);
  res.json(scored.slice(0, 50));
});

module.exports = router;
