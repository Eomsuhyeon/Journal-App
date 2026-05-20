import { useState } from 'react';
import { login, register } from '../api';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ nickname: '', email: '', password: '' });

  const handleSubmit = async () => {
    if (isRegister) {
      await register(form);
      alert('회원가입 완료! 로그인해줘');
      setIsRegister(false);
    } else {
      const data = await login(form);
      if (data.token) onLogin(data.token);
      else alert(data.error);
    }
  };

  return (
    <div style={{ padding: '80px 24px', maxWidth: 400, margin: '0 auto' }}>
      <div style={{ fontFamily: 'serif', fontSize: 28, color: '#1A1714', marginBottom: 8 }}>나를 알아가는 일기 ✦</div>
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