const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { nickname, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ nickname, email, password: hashed });
    res.json({ message: '회원가입 성공', userId: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: '유저 없음' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: '비밀번호 틀림' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, nickname: user.nickname });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
