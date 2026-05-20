// ── User 모델 ──
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  streak:   { type: Number, default: 0 },
  lastWrittenAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
