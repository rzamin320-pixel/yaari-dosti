const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir); },
  filename: function (req, file, cb) { cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname)); }
});
const upload = multer({ storage });

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

router.put('/me', auth, async (req, res) => {
  const updates = req.body;
  delete updates.passwordHash;
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-passwordHash');
  res.json(user);
});

router.post('/me/photo', auth, upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const photoUrl = `http://localhost:4000/uploads/${req.file.filename}`;
  const user = await User.findById(req.user.id);
  user.photos = user.photos || [];
  user.photos.push(photoUrl);
  await user.save();
  res.json({ photo: photoUrl });
});

module.exports = router;
