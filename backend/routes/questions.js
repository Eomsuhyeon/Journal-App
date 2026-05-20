const router = require('express').Router();
const auth = require('../middleware/auth');
const Entry = require('../models/Entry');
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// 오늘의 질문 생성 (AI가 과거 답변 보고 생성)
router.get('/today', auth, async (req, res) => {
  try {
    // 최근 5개 답변 가져오기
    const recentEntries = await Entry.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('question answer mood');

    // 처음 쓰는 유저면 기본 질문
    if (recentEntries.length === 0) {
      return res.json({ question: '오늘 하루를 한 단어로 표현한다면?' });
    }

    // AI에게 맥락 기반 질문 생성 요청
    const context = recentEntries.map(e =>
      `Q: ${e.question}\nA: ${e.answer}\n기분: ${e.mood}`
    ).join('\n\n');

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `다음은 사용자의 최근 일기 답변들이야:\n\n${context}\n\n이 사람에게 오늘 던질 자기탐구 질문 1개만 만들어줘. 
        - 답변 맥락을 자연스럽게 이어받아서
        - 너무 무겁지 않게
        - 30자 이내로
        - 질문만 출력해, 다른 말 없이`
      }]
    });

    const question = response.content[0].text.trim();
    res.json({ question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
