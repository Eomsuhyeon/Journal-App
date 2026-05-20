import { useState, useEffect } from 'react';
import { searchFriends, addFriend, getMyFriends } from '../api';

export default function Friends({ goTo }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [added, setAdded] = useState({});

  useEffect(() => {
    getMyFriends().then(data => {
      if (Array.isArray(data)) setFriends(data);
    });
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) return;
    const data = await searchFriends(search);
    if (Array.isArray(data)) setResults(data);
  };

  const handleAdd = async (friendId) => {
    const result = await addFriend(friendId);
    console.log('친구 추가 결과:', result); // 확인용
    setAdded(prev => ({ ...prev, [friendId]: true }));
  
    // 친구 목록 새로고침
  const data = await getMyFriends();
  console.log('친구 목록:', data); // 확인용
  if (Array.isArray(data)) setFriends(data);
};

  return (
    <div style={{ padding: '48px 24px 100px' }}>
      <button onClick={() => goTo('home')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#8A8480', marginBottom: 20 }}>←</button>
      <div style={{ fontFamily: 'serif', fontSize: 22, color: '#1A1714', marginBottom: 24 }}>친구 추가</div>

      {/* 검색 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="닉네임으로 검색"
          style={{ flex: 1, padding: '12px 16px', border: '1px solid #D4CBC0', borderRadius: 12, fontSize: 14, background: 'transparent', outline: 'none' }}
        />
        <button onClick={handleSearch}
          style={{ padding: '12px 18px', background: '#1A1714', color: '#F5F0E8', border: 'none', borderRadius: 12, fontSize: 14, cursor: 'pointer' }}>
          검색
        </button>
      </div>

      {/* 검색 결과 */}
      {results.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.1em', color: '#8A8480', marginBottom: 12 }}>검색 결과</div>
          {results.map(user => (
            <div key={user._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E8E0D4' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E8E0D4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, color: '#1A1714' }}>
                  {user.nickname[0]}
                </div>
                <div style={{ fontSize: 14, color: '#1A1714', fontWeight: 500 }}>{user.nickname}</div>
              </div>
              <button onClick={() => handleAdd(user._id)} disabled={added[user._id]}
                style={{ padding: '8px 16px', background: added[user._id] ? '#E8E0D4' : '#1A1714', color: added[user._id] ? '#8A8480' : '#F5F0E8', border: 'none', borderRadius: 10, fontSize: 12, cursor: added[user._id] ? 'default' : 'pointer' }}>
                {added[user._id] ? '추가됨 ✓' : '추가'}
              </button>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && search && (
        <div style={{ fontSize: 13, color: '#8A8480', marginBottom: 32 }}>검색 결과가 없어요</div>
      )}

      {/* 내 친구 목록 */}
      <div>
        <div style={{ fontSize: 11, letterSpacing: '0.1em', color: '#8A8480', marginBottom: 12 }}>
          친구 {friends.length}명
        </div>
        {friends.length === 0 ? (
          <div style={{ fontSize: 13, color: '#8A8480' }}>아직 친구가 없어요. 닉네임으로 검색해보세요!</div>
        ) : (
          friends.map(friend => (
            <div key={friend._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #E8E0D4' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E8E0D4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, color: '#1A1714' }}>
                {friend.nickname[0]}
              </div>
              <div>
                <div style={{ fontSize: 14, color: '#1A1714', fontWeight: 500 }}>{friend.nickname}</div>
                <div style={{ fontSize: 11, color: '#8A8480', marginTop: 2 }}>
                  {friend.streak > 0 ? `🔥 ${friend.streak}일 연속` : '아직 기록 없음'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}