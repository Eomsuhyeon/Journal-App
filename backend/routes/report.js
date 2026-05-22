const router = require('express').Router();
const auth = require('../middleware/auth');
const Entry = require('../models/Entry');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.get('/generate', auth, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .select('question answer mood createdAt');

    if (entries.length < 3) {
      return res.status(400).json({ error: '리포트 생성을 위해 최소 3개의 일기가 필요해요' });
    }

    const context = entries.map(e =>
      `날짜: ${e.createdAt.toLocaleDateString('ko-KR')}\nQ: ${e.question}\nA: ${e.answer}\n기분: ${e.mood}`
    ).join('\n\n---\n\n');

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `다음은 한 사람의 최근 일기야:\n\n${context}\n\n이 사람의 자아 리포트를 아래 형식으로 작성해줘. 따뜻하고 통찰력 있게.\n\n[에너지 패턴]\n이 사람이 에너지를 얻는 곳과 소모되는 상황 분석 (2-3문장)\n\n[감정 패턴]\n자주 등장하는 감정과 그 맥락 (2-3문장)\n\n[나만의 강점]\n답변에서 보이는 이 사람의 강점 (2-3문장)\n\n[성장 포인트]\n조심스럽게 제안하는 성장 방향 (1-2문장)\n\n[한 줄 요약]\n이 사람을 한 문장으로 표현`
      }],
      max_tokens: 1000,
    });

    const report = completion.choices[0].message.content.trim();
    res.json({ report, analyzedCount: entries.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;