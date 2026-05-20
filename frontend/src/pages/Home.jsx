import { useState, useEffect } from 'react';
import { getTodayQuestion, getFriendsFeed, getMyEntries } from '../api';

export default function Home({ goTo }) {
  const [question, setQuestion] = useState('로딩 중...');
  const [feed, setFeed] = useState([]);
  const [answeredToday, setAnsweredToday] = useState(false);

  useEffect(() => {
    getTodayQuestion()
      .then(d => { if (d.question) setQuestion(d.question); })
      .catch(() => setQuestion('오늘 나에게 가장 솔직한 감정은?'));

    getFriendsFeed()
      .then(data => { if (Array.isArray(data)) setFeed(data); else setFeed([]); })
      .catch(() => setFeed([]));

    // 오늘 이미 답했는지 확인
    // getMyEntries().then(entries => {
    //   if (!Array.isArray(entries)) return;
    //   const today = new Date().toDateString();
    //   const todayEntry = entries.find(e => new Date(e.createdAt).toDateString() === today);
    //   if (todayEntry) setAnsweredToday(true);
    // });
  }, []);

  return (
    <div style={{ padding: '48px 24px 100px' }}>
      <div style={{ fontSize: 11, letterSpacing: '0.12em', color: '#8A8480', marginBottom: 6 }}>
        {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
      </div>
      <div style={{ fontFamily: 'serif', fontSize: 22, color: '#1A1714', marginBottom: 24 }}>
        오늘도<br />나를 알아가는 하루 ✦
      </div>

      {/* 질문 카드 — 답했으면 완료 상태 */}
      {answeredToday ? (
        <div style={{ background: '#1A1714', borderRadius: 20, padding: '28px 24px', marginBottom: 28 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', color: '#C4733A', marginBottom: 12 }}>오늘의 기록 완료</div>
          <div style={{ fontFamily: 'serif', fontSize: 17, color: '#F5F0E8', lineHeight: 1.6 }}>
            내일 또 새로운 질문이<br />찾아올게요 🌙
          </div>
          <div style={{ marginTop: 20, fontSize: 11, color: '#8A8480' }}>앨범에서 오늘의 기록 보기 →</div>
        </div>
      ) : (
        <div onClick={() => goTo('write')}
          style={{ background: '#1A1714', borderRadius: 20, padding: '28px 24px', cursor: 'pointer', marginBottom: 28 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', color: '#C4733A', marginBottom: 12 }}>오늘의 질문</div>
          <div style={{ fontFamily: 'serif', fontSize: 17, color: '#F5F0E8', lineHeight: 1.6 }}>
            {question}
          </div>
          <div style={{ marginTop: 20, fontSize: 11, color: '#8A8480' }}>답하러 가기 →</div>
        </div>
      )}

      {/* 친구 피드 */}
      <div style={{ fontSize: 11, letterSpacing: '0.1em', color: '#8A8480', marginBottom: 14 }}>친구들의 오늘</div>
      {feed.length === 0 ? (
        <div style={{ fontSize: 13, color: '#8A8480' }}>아직 친구가 없어요. 친구를 추가해보세요!</div>
      ) : (
        feed.map(entry => (
          <div key={entry._id} style={{ padding: '12px 0', borderBottom: '1px solid #E8E0D4' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1714' }}>{entry.user?.nickname}</div>
            <div style={{ fontSize: 12, color: '#8A8480', marginTop: 4 }}>
              {entry.answer?.slice(0, 40)}...
            </div>
            <div style={{ fontSize: 16, marginTop: 6 }}>{entry.mood}</div>
          </div>
        ))
      )}
    </div>
  );
}