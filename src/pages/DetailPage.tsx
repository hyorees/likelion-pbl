import { useParams, useNavigate } from 'react-router-dom';
import { Lion } from '../types/lion';
import { DetailCard } from '../components/DetailCard';

interface DetailPageProps {
  lions: Lion[];
}

function DetailPage({ lions }: DetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const currentLion = lions.find(lion => String(lion.id) === String(id));

  if (!currentLion) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p className="count-text">해당 아기 사자를 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/')} style={{ marginTop: '20px' }}>목록으로 돌아가기</button>
      </div>
    );
  }

  return (
    <section className="detail-section">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
        <button onClick={() => navigate(-1)}>← 목록으로 돌아가기</button>
      </div>
      <DetailCard lion={currentLion} />
    </section>
  );
}

export default DetailPage;