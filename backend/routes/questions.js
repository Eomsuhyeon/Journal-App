const router = require('express').Router();
const auth = require('../middleware/auth');
const Entry = require('../models/Entry');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const fallbackQuestions = [
  '오늘 나에게 가장 솔직한 감정은?',
  '요즘 나에게 에너지를 주는 것은?',
  '오늘 가장 잘한 선택은?',
  '지금 나를 가장 무겁게 하는 것은?',
  '오늘 하루를 한 단어로 표현한다면?',
  '최근에 나를 설레게 한 것은?',
  '요즘 가장 자주 드는 감정은?',
  '오늘 누군가에게 고마움을 느꼈나요?',
  '지금 나에게 필요한 것은?',
  '오늘 나를 가장 나답게 만든 순간은?',
];

router.get('/today', auth, async (req, res) => {
  try {
    const recentEntries = await Entry.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('question answer mood');

    if (recentEntries.length === 0) {
      return res.json({ question: fallbackQuestions[0] });
    }

    const context = recentEntries.map(e =>
      `Q: ${e.question}\nA: ${e.answer}\n기분: ${e.mood}`
    ).join('\n\n');

    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'user',
          content: `다음은 사용자의 최근 일기 답변들이야:\n\n${context}\n\n이 사람에게 오늘 던질 자기탐구 질문 1개만 만들어줘. 답변 맥락을 자연스럽게 이어받아서, 너무 무겁지 않게, 30자 이내로, 질문만 출력해 다른 말 없이`
        }],
        max_tokens: 100,
      });

      const question = completion.choices[0].message.content.trim();
      res.json({ question });
    } catch (aiErr) {
      console.error('Groq 오류, fallback 사용:', aiErr.message);
      const written = recentEntries.map(e => e.question);
      const remaining = fallbackQuestions.filter(q => !written.includes(q));
      const random = remaining.length > 0
        ? remaining[Math.floor(Math.random() * remaining.length)]
        : fallbackQuestions[0];
      res.json({ question: random });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;