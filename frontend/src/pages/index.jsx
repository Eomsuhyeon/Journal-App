// ── Write Page ──
import { useState, useEffect } from 'react';
import { getTodayQuestion, createEntry } from '../api';

export function Write({ goTo }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [mood, setMood] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    getTodayQuestion().then(d => setQuestion(d.question));
  }, []);

  const handleSubmit = async () => {
    if (!answer || !mood) return alert('답변과 기분을 선택해주세요');
    await createEntry({ question, answer, mood, isPublic });
    goTo('home');
  };

  return (
    <div style={{ padding: '48px 24px 100px', minHeight: '100vh' }}>
      <button onClick={() => goTo('home')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#8A8480', marginBottom: 20 }}>←</button>
      <div style={{ fontFamily: 'Gowun Batang, serif', fontSize: 19, color: '#1A1714', lineHeight: 1.6, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #E8E0D4' }}>
        {question}
      </div>
      <textarea
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="여기에 자유롭게 써보세요..."
        style={{ width: '100%', height: 200, background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontSize: 15, color: '#1A1714', lineHeight: 1.8, fontFamily: 'Pretendard, sans-serif' }}
      />
      <div style={{ fontSize: 11, color: '#D4CBC0', textAlign: 'right', marginBottom: 20 }}>{answer.length}자</div>

      {/* 무드 선택 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['😊','😐','😔','😤','🥹'].map(m => (
          <button key={m} onClick={() => setMood(m)}
            style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: `1px solid ${mood === m ? '#C4733A' : '#D4CBC0'}`, background: mood === m ? '#E8E0D4' : 'transparent', fontSize: 18, cursor: 'pointer' }}>
            {m}
          </button>
        ))}
      </div>

      {/* 공개 여부 */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#8A8480', marginBottom: 20, cursor: 'pointer' }}>
        <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
        친구에게 공개
      </label>

      <button onClick={handleSubmit}
        style={{ width: '100%', padding: 16, background: '#1A1714', color: '#F5F0E8', border: 'none', borderRadius: 16, fontSize: 14, cursor: 'pointer' }}>
        기록하기
      </button>
    </div>
  );
}

// ── Album Page ──
import { getMyEntries } from '../api';

export function Album({ goTo }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    getMyEntries().then(setEntries);
  }, []);

  return (
    <div style={{ padding: '48px 24px 100px' }}>
      <div style={{ fontFamily: 'Gowun Batang, serif', fontSize: 22, color: '#1A1714', marginBottom: 4 }}>나의 기록</div>
      <div style={{ fontSize: 12, color: '#8A8480', marginBottom: 24 }}>지금까지 {entries.length}개의 답을 남겼어요</div>
      {entries.map(entry => (
        <div key={entry._id} style={{ padding: '16px 0', borderBottom: '1px solid #E8E0D4' }}>
          <div style={{ fontSize: 10, color: '#C4733A', letterSpacing: '0.1em', marginBottom: 6 }}>
            {new Date(entry.createdAt).toLocaleDateString('ko-KR')}
          </div>
          <div style={{ fontFamily: 'Gowun Batang, serif', fontSize: 14, color: '#8A8480', marginBottom: 6 }}>{entry.question}</div>
          <div style={{ fontSize: 14, color: '#1A1714', lineHeight: 1.6 }}>{entry.answer}</div>
          <div style={{ fontSize: 16, marginTop: 8 }}>{entry.mood}</div>
        </div>
      ))}
    </div>
  );
}

// ── Report Page ──
import { generateReport } from '../api';

export function Report({ goTo }) {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzedCount, setAnalyzedCount] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    const data = await generateReport();
    if (data.error) { alert(data.error); setLoading(false); return; }
    setReport(data.report);
    setAnalyzedCount(data.analyzedCount);
    setLoading(false);
  };

  return (
    <div style={{ padding: '48px 24px 100px' }}>
      <div style={{ fontFamily: 'Gowun Batang, serif', fontSize: 22, color: '#1A1714', marginBottom: 4 }}>나의 자아 리포트 ✦</div>
      <div style={{ fontSize: 12, color: '#8A8480', marginBottom: 24 }}>AI가 나의 답변을 분석해 나를 알려줘요</div>

      {!report ? (
        <button onClick={handleGenerate} disabled={loading}
          style={{ width: '100%', padding: 16, background: '#1A1714', color: '#F5F0E8', border: 'none', borderRadius: 16, fontSize: 14, cursor: 'pointer' }}>
          {loading ? '분석 중... ✦' : '리포트 생성하기'}
        </button>
      ) : (
        <div>
          <div style={{ fontSize: 11, color: '#8A8480', marginBottom: 16 }}>최근 {analyzedCount}개의 답변을 분석했어요</div>
          <div style={{ background: '#1A1714', borderRadius: 20, padding: '28px 24px' }}>
            <pre style={{ fontFamily: 'Pretendard, sans-serif', fontSize: 14, color: '#F5F0E8', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {report}
            </pre>
          </div>
          <button onClick={() => setReport('')}
            style={{ width: '100%', marginTop: 16, padding: 16, background: 'transparent', color: '#8A8480', border: '1px solid #D4CBC0', borderRadius: 16, fontSize: 14, cursor: 'pointer' }}>
            다시 생성하기
          </button>
        </div>
      )}
    </div>
  );
}

// ── Login Page ──
import { login, register } from '../api';

export function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ nickname: '', email: '', password: '' });

  const handleSubmit = async () => {
    if (isRegister) {
      await register(form);
      setIsRegister(false);
    } else {
      const data = await login(form);
      if (data.token) onLogin(data.token);
      else alert(data.error);
    }
  };

  return (
    <div style={{ padding: '80px 24px', maxWidth: 400, margin: '0 auto' }}>
      <div style={{ fontFamily: 'Gowun Batang, serif', fontSize: 28, color: '#1A1714', marginBottom: 8 }}>
        나를 알아가는 일기 ✦
      </div>
      <div style={{ fontSize: 13, color: '#8A8480', marginBottom: 40 }}>매일 하나의 질문으로 나를 발견해요</div>

      {isRegister && (
        <input placeholder="닉네임" value={form.nickname} onChange={e => setForm({...form, nickname: e.target.value})}
          style={{ width: '100%', padding: '14px 16px', border: '1px solid #D4CBC0', borderRadius: 12, fontSize: 14, marginBottom: 12, background: 'transparent', outline: 'none', boxSizing: 'border-box' }} />
      )}
      <input placeholder="이메일" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
        style={{ width: '100%', padding: '14px 16px', border: '1px solid #D4CBC0', borderRadius: 12, fontSize: 14, marginBottom: 12, background: 'transparent', outline: 'none', boxSizing: 'border-box' }} />
      <input type="password" placeholder="비밀번호" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
        style={{ width: '100%', padding: '14px 16px', border: '1px solid #D4CBC0', borderRadius: 12, fontSize: 14, marginBottom: 20, background: 'transparent', outline: 'none', boxSizing: 'border-box' }} />

      <button onClick={handleSubmit}
        style={{ width: '100%', padding: 16, background: '#1A1714', color: '#F5F0E8', border: 'none', borderRadius: 16, fontSize: 14, cursor: 'pointer', marginBottom: 12 }}>
        {isRegister ? '회원가입' : '로그인'}
      </button>
      <button onClick={() => setIsRegister(!isRegister)}
        style={{ width: '100%', padding: 16, background: 'transparent', color: '#8A8480', border: '1px solid #D4CBC0', borderRadius: 16, fontSize: 14, cursor: 'pointer' }}>
        {isRegister ? '이미 계정이 있어요' : '처음이에요, 회원가입'}
      </button>
    </div>
  );
}
