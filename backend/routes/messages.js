const express = require('express');
const auth = require('../middleware/auth');
const Message = require('../models/Message');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { to, text } = req.body;
  if (!to || !text) return res.status(400).json({ message: 'Missing fields' });
  const message = new Message({ from: req.user.id, to, text });
  await message.save();
  res.json(message);
});

router.get('/:otherId', auth, async (req, res) => {
  const messages = await Message.find({
    $or: [
      { from: req.user.id, to: req.params.otherId },
      { from: req.params.otherId, to: req.user.id }
    ]
  }).sort('createdAt');
  res.json(messages);
});

module.exports = router;
