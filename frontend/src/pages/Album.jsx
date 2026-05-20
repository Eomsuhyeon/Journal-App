import { useState, useEffect } from 'react';
import { getMyEntries, getMyPhotos } from '../api';

export default function Album({ goTo }) {
  const [entries, setEntries] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [view, setView] = useState('diary'); // 'diary' | 'photos'
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getMyEntries().then(data => { if (Array.isArray(data)) setEntries(data); });
    getMyPhotos().then(data => { if (Array.isArray(data)) setPhotos(data); });
  }, []);

  return (
    <div style={{ padding: '48px 24px 100px' }}>

      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: 'serif', fontSize: 22, color: '#1A1714' }}>나의 기록</div>
          <div style={{ fontSize: 12, color: '#8A8480', marginTop: 4 }}>지금까지 {entries.length}개의 답을 남겼어요</div>
        </div>
        <button onClick={() => setView(view === 'diary' ? 'photos' : 'diary')}
          style={{ padding: '8px 14px', background: view === 'photos' ? '#1A1714' : 'transparent', color: view === 'photos' ? '#F5F0E8' : '#8A8480', border: '1px solid #D4CBC0', borderRadius: 10, fontSize: 12, cursor: 'pointer' }}>
          {view === 'diary' ? '📷 사진만 보기' : '📝 일기 보기'}
        </button>
      </div>

      {/* 일기 뷰 */}
      {view === 'diary' && (
        entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#8A8480', fontSize: 13 }}>아직 기록이 없어요</div>
        ) : (
          entries.map(entry => (
            <div key={entry._id} style={{ padding: '16px 0', borderBottom: '1px solid #E8E0D4' }}>
              <div style={{ fontSize: 10, color: '#C4733A', letterSpacing: '0.1em', marginBottom: 6 }}>
                {new Date(entry.createdAt).toLocaleDateString('ko-KR')}
              </div>
              <div style={{ fontFamily: 'serif', fontSize: 14, color: '#8A8480', marginBottom: 6 }}>{entry.question}</div>
              <div style={{ fontSize: 14, color: '#1A1714', lineHeight: 1.6 }}>{entry.answer}</div>
              {entry.image && (
                <img src={entry.image} alt=""
                  style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12, marginTop: 10 }} />
              )}
              <div style={{ fontSize: 16, marginTop: 8 }}>{entry.mood}</div>
            </div>
          ))
        )
      )}

      {/* 사진 뷰 */}
      {view === 'photos' && (
        photos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#8A8480', fontSize: 13 }}>
            아직 사진이 없어요.<br />일기에 사진을 추가해보세요 📷
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
            {photos.map(photo => (
              <div key={photo._id} onClick={() => setSelected(photo)}
                style={{ aspectRatio: '1', cursor: 'pointer', overflow: 'hidden', borderRadius: 8 }}>
                <img src={photo.image} alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )
      )}

      {/* 사진 상세 보기 */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 100 }}>
          <img src={selected.image} alt=""
            style={{ width: '100%', maxWidth: 360, borderRadius: 16, objectFit: 'contain', maxHeight: '60vh' }} />
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 16, marginBottom: 8 }}>{selected.mood}</div>
            <div style={{ fontSize: 13, color: '#aaa', marginBottom: 8 }}>{selected.question}</div>
            <div style={{ fontSize: 11, color: '#666' }}>
              {new Date(selected.createdAt).toLocaleDateString('ko-KR')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}