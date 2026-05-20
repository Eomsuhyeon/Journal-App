import { useState, useEffect } from 'react';
import { getMyPhotos } from '../api';

export default function Gallery({ goTo }) {
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getMyPhotos().then(data => {
      if (Array.isArray(data)) setPhotos(data);
    });
  }, []);

  return (
    <div style={{ padding: '48px 24px 100px' }}>
      <div style={{ fontFamily: 'serif', fontSize: 22, color: '#1A1714', marginBottom: 4 }}>사진 기록 📷</div>
      <div style={{ fontSize: 12, color: '#8A8480', marginBottom: 24 }}>사진이 담긴 일기 {photos.length}개</div>

      {photos.length === 0 ? (
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