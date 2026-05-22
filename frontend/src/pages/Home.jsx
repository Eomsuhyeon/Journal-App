import { useState, useEffect } from 'react';
import { getTodayQuestion, getFriendsFeed, getMyEntries, getMyFriends, getMyStreak } from '../api';

export default function Home({ goTo }) {
  const [question, setQuestion] = useState('로딩 중...');
  const [feed, setFeed] = useState([]);
  const [friends, setFriends] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    getTodayQuestion()
      .then(d => { if (d.question) setQuestion(d.question); })
      .catch(() => setQuestion('오늘 나에게 가장 솔직한 감정은?'));

    getFriendsFeed()
      .then(data => { if (Array.isArray(data)) setFeed(data); else setFeed([]); })
      .catch(() => setFeed([]));

    getMyFriends().then(data => {
      if (Array.isArray(data)) setFriends(data);
    });

    getMyStreak().then(data => {
      if (data.streak !== undefined) setStreak(data.streak);
    });
  }, []);

  return (
    <div style={{ padding: '48px 24px 100px' }}>
      <div style={{ fontSize: 11, letterSpacing: '0.12em', color: '#8A8480', marginBottom: 6 }}>
        {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
      </div>
      <div style={{ fontFamily: 'serif', fontSize: 22, color: '#1A1714', marginBottom: 16 }}>
        오늘도<br />나를 알아가는 하루 ✦
      </div>

      {/* 스트릭 */}
      {streak > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#1A1714', borderRadius: 14, padding: '12px 18px', marginBottom: 20, width: 'fit-content' }}>
          <span style={{ fontSize: 22 }}>🔥</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#F5F0E8' }}>{streak}일 연속 기록 중</div>
            <div style={{ fontSize: 11, color: '#8A8480', marginTop: 2 }}>오늘도 써야 불꽃이 꺼지지 않아요</div>
          </div>
        </div>
      )}

      {/* 오늘의 질문 카드 */}
      <div onClick={() => goTo('write')}
        style={{ background: '#1A1714', borderRadius: 20, padding: '28px 24px', cursor: 'pointer', marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.1em', color: '#C4733A', marginBottom: 12 }}>오늘의 질문</div>
        <div style={{ fontFamily: 'serif', fontSize: 17, color: '#F5F0E8', lineHeight: 1.6 }}>
          {question}
        </div>
        <div style={{ marginTop: 20, fontSize: 11, color: '#8A8480' }}>답하러 가기 →</div>
      </div>

      {/* 친구 피드 */}
      <div style={{ fontSize: 11, letterSpacing: '0.1em', color: '#8A8480', marginBottom: 14 }}>친구들의 오늘</div>
      {feed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          {friends.length === 0 ? (
            <>
              <div style={{ fontSize: 13, color: '#8A8480', marginBottom: 12 }}>아직 친구가 없어요</div>
              <button onClick={() => goTo('friends')}
                style={{ padding: '10px 24px', background: '#1A1714', color: '#F5F0E8', border: 'none', borderRadius: 12, fontSize: 13, cursor: 'pointer' }}>
                친구 추가하기 →
              </button>
            </>
          ) : (
            <div style={{ fontSize: 13, color: '#8A8480' }}>
              아직 친구가 오늘 일기를 작성하지 않았어요 🌙
            </div>
          )}
        </div>
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