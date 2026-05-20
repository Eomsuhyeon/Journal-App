import { useState } from 'react';
import { generateReport } from '../api';

export default function Report({ goTo }) {
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
      <div style={{ fontFamily: 'serif', fontSize: 22, color: '#1A1714', marginBottom: 4 }}>나의 자아 리포트 ✦</div>
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
            <pre style={{ fontFamily: 'sans-serif', fontSize: 14, color: '#F5F0E8', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
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