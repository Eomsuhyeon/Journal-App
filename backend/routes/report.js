const router = require('express').Router();
const auth = require('../middleware/auth');
const Entry = require('../models/Entry');
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// AI 자아 리포트 생성 (30일치 분석)
router.get('/generate', auth, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .select('question answer mood createdAt');

    if (entries.length < 7) {
      return res.status(400).json({ error: '리포트 생성을 위해 최소 7개의 일기가 필요해요' });
    }

    const context = entries.map(e =>
      `날짜: ${e.createdAt.toLocaleDateString('ko-KR')}\nQ: ${e.question}\nA: ${e.answer}\n기분: ${e.mood}`
    ).join('\n\n---\n\n');

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `다음은 한 사람의 최근 일기야:\n\n${context}\n\n
이 사람의 자아 리포트를 아래 형식으로 작성해줘. 따뜻하고 통찰력 있게.

[에너지 패턴]
이 사람이 에너지를 얻는 곳과 소모되는 상황 분석 (2-3문장)

[감정 패턴]
자주 등장하는 감정과 그 맥락 (2-3문장)

[나만의 강점]
답변에서 보이는 이 사람의 강점 (2-3문장)

[성장 포인트]
조심스럽게 제안하는 성장 방향 (1-2문장)

[한 줄 요약]
이 사람을 한 문장으로 표현`
      }]
    });

    const report = response.content[0].text.trim();
    res.json({ report, analyzedCount: entries.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
