import { useState, useEffect } from 'react';
import { getMyEntries } from '../api';

export default function Album({ goTo }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    getMyEntries().then(setEntries);
  }, []);

  return (
    <div style={{ padding: '48px 24px 100px' }}>
      <div style={{ fontFamily: 'serif', fontSize: 22, color: '#1A1714', marginBottom: 4 }}>나의 기록</div>
      <div style={{ fontSize: 12, color: '#8A8480', marginBottom: 24 }}>지금까지 {entries.length}개의 답을 남겼어요</div>
      {entries.map(entry => (
        <div key={entry._id} style={{ padding: '16px 0', borderBottom: '1px solid #E8E0D4' }}>
          <div style={{ fontSize: 10, color: '#C4733A', letterSpacing: '0.1em', marginBottom: 6 }}>
            {new Date(entry.createdAt).toLocaleDateString('ko-KR')}
          </div>
          <div style={{ fontFamily: 'serif', fontSize: 14, color: '#8A8480', marginBottom: 6 }}>{entry.question}</div>
          <div style={{ fontSize: 14, color: '#1A1714', lineHeight: 1.6 }}>{entry.answer}</div>
          <div style={{ fontSize: 16, marginTop: 8 }}>{entry.mood}</div>
        </div>
      ))}
    </div>
  );
}