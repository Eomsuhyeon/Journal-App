const router = require('express').Router();
const auth = require('../middleware/auth');
const Entry = require('../models/Entry');

// 일기 작성
router.post('/', auth, async (req, res) => {
  try {
    const { question, answer, mood, isPublic, image } = req.body;
    const entry = await Entry.create({
      user: req.userId,
      question, answer, mood, isPublic, image,
    });

    // 스트릭 업데이트
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    const now = new Date();
    const today = now.toDateString();
    const lastWritten = user.lastWrittenAt ? new Date(user.lastWrittenAt).toDateString() : null;
    const yesterday = new Date(now - 86400000).toDateString();

    if (lastWritten === today) {
      // 오늘 이미 썼으면 스트릭 그대로
    } else if (lastWritten === yesterday) {
      // 어제 썼으면 +1
      await User.findByIdAndUpdate(req.userId, {
        streak: user.streak + 1,
        lastWrittenAt: now,
      });
    } else {
      // 하루라도 빠지면 1로 리셋
      await User.findByIdAndUpdate(req.userId, {
        streak: 1,
        lastWrittenAt: now,
      });
    }

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

// 사진만 모아보기
router.get('/photos', auth, async (req, res) => {
  try {
    const entries = await Entry.find({
      user: req.userId,
      image: { $ne: null }
    }).sort({ createdAt: -1 }).select('image createdAt question mood');
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

    if (!me.friends || me.friends.length === 0) {
      return res.json([]);
    }

    const entries = await Entry.find({
      user: { $in: me.friends },
      isPublic: true,
    })
    .populate('user', 'nickname')
    .sort({ createdAt: -1 })
    .limit(20);

    res.json(entries);
  } catch (err) {
    console.error(err);
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