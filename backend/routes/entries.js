const router = require('express').Router();
const auth = require('../middleware/auth');
const Entry = require('../models/Entry');

// 일기 작성
router.post('/', auth, async (req, res) => {
  try {
    const { question, answer, mood, isPublic } = req.body;
    const entry = await Entry.create({
      user: req.userId,
      question, answer, mood, isPublic,
    });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 내 일기 전체 조회 (앨범)
router.get('/mine', auth, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 친구 피드 조회
router.get('/friends-feed', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const me = await User.findById(req.userId);
    const entries = await Entry.find({
      user: { $in: me.friends },
      isPublic: true,
    })
    .populate('user', 'nickname')
    .sort({ createdAt: -1 })
    .limit(20);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 리액션 추가
router.post('/:id/react', auth, async (req, res) => {
  try {
    const { emoji } = req.body;
    const entry = await Entry.findByIdAndUpdate(
      req.params.id,
      { $push: { reactions: { from: req.userId, emoji } } },
      { new: true }
    );
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
