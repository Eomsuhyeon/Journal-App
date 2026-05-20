export default function Profile({ goTo, onLogout }) {
  const nickname = localStorage.getItem('nickname') || '나';

  return (
    <div style={{ padding: '48px 24px 100px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#1A1714', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#F5F0E8', margin: '0 auto 16px' }}>
          {nickname[0]}
        </div>
        <div style={{ fontFamily: 'serif', fontSize: 22, color: '#1A1714' }}>{nickname}</div>
      </div>
      <div style={{ borderTop: '1px solid #E8E0D4', paddingTop: 24 }}>
        <button onClick={onLogout}
          style={{ width: '100%', padding: 16, background: 'transparent', color: '#C4733A', border: '1px solid #C4733A', borderRadius: 16, fontSize: 14, cursor: 'pointer' }}>
          로그아웃
        </button>
      </div>
    </div>
  );
}