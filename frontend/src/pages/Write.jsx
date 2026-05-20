import { useState, useEffect } from 'react';
import { getTodayQuestion, createEntry } from '../api';

export default function Write({ goTo }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [mood, setMood] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    getTodayQuestion().then(d => { if (d.question) setQuestion(d.question); });
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setImage(reader.result); // base64로 저장
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!answer || !mood) return alert('답변과 기분을 선택해주세요');
    await createEntry({ question, answer, mood, isPublic, image });
    setDone(true);
  };

  if (done) return (
    <div style={{ padding: '80px 24px', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 24 }}>✦</div>
      <div style={{ fontFamily: 'serif', fontSize: 22, color: '#1A1714', marginBottom: 12 }}>오늘의 기록 완료</div>
      <div style={{ fontSize: 14, color: '#8A8480', lineHeight: 1.8, marginBottom: 40 }}>
        내일 또 새로운 질문이 찾아올게요.<br />조금씩, 나를 알아가는 중이에요 🌙
      </div>
      <div style={{ fontSize: 16, marginBottom: 40 }}>{mood}</div>
      <button onClick={() => goTo('home')}
        style={{ padding: '14px 32px', background: '#1A1714', color: '#F5F0E8', border: 'none', borderRadius: 16, fontSize: 14, cursor: 'pointer' }}>
        홈으로 돌아가기
      </button>
    </div>
  );

  return (
    <div style={{ padding: '48px 24px 100px' }}>
      <button onClick={() => goTo('home')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#8A8480', marginBottom: 20 }}>←</button>
      <div style={{ fontFamily: 'serif', fontSize: 19, color: '#1A1714', lineHeight: 1.6, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #E8E0D4' }}>
        {question}
      </div>
      <textarea
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="여기에 자유롭게 써보세요..."
        style={{ width: '100%', height: 160, background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontSize: 15, color: '#1A1714', lineHeight: 1.8 }}
      />
      <div style={{ fontSize: 11, color: '#D4CBC0', textAlign: 'right', marginBottom: 20 }}>{answer.length}자</div>

      {/* 사진 첨부 */}
      <div style={{ marginBottom: 20 }}>
        {preview ? (
          <div style={{ position: 'relative' }}>
            <img src={preview} alt="첨부 사진"
              style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 16 }} />
            <button onClick={() => { setPreview(null); setImage(null); }}
              style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14 }}>
              ✕
            </button>
          </div>
        ) : (
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', border: '1px dashed #D4CBC0', borderRadius: 16, cursor: 'pointer', color: '#8A8480', fontSize: 13 }}>
            📷 사진 추가하기
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
          </label>
        )}
      </div>

      {/* 무드 선택 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['😊','😐','😔','😤','🥹'].map(m => (
          <button key={m} onClick={() => setMood(m)}
            style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: `1px solid ${mood === m ? '#C4733A' : '#D4CBC0'}`, background: mood === m ? '#E8E0D4' : 'transparent', fontSize: 18, cursor: 'pointer' }}>
            {m}
          </button>
        ))}
      </div>

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