const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question:  { type: String, required: true },
  answer:    { type: String, required: true },
  mood:      { type: String, enum: ['😊','😐','😔','😤','🥹'], required: true },
  image:     { type: String, default: null },
  isPublic:  { type: Boolean, default: false }, // 친구 공개 여부
  reactions: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    emoji: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Entry', EntrySchema);
