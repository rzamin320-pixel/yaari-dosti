const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  birthday: { type: Date },
  gender: { type: String },
  lookingFor: { type: String, default: 'any' },
  bio: { type: String },
  interests: [String],
  photos: [String],
  isAdmin: { type: Boolean, default: false },
  subscribed: { type: Boolean, default: false },
  stripeCustomerId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
