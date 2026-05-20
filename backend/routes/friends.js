const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// 친구 검색
router.get('/search', auth, async (req, res) => {
  try {
    const { nickname } = req.query;
    const users = await User.find({
      nickname: { $regex: nickname, $options: 'i' },
      _id: { $ne: req.userId }
    }).select('nickname _id');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 친구 추가
router.post('/add/:friendId', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { friends: req.params.friendId }
    });
    res.json({ message: '친구 추가 완료' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 내 친구 목록
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends', 'nickname streak lastWrittenAt');
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
