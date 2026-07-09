import { Lion } from '../types/lion';

interface DetailCardProps {
  lion: Lion;
}

interface DetailListProps {
  lions: Lion[];
}

export function DetailCard({ lion }: DetailCardProps) {
  return (
    <article className="card-detail">
      <h2 className="detail-name">{lion.name}</h2>
      <p className="detail-part">{lion.part}</p>
      <div className="detail-section">
        <h4>자기소개</h4>
        <p>{lion.intro || ''}</p>
      </div>
      <div className="detail-section">
        <h4>연락처</h4>
        <ul>
          <li>Email: {lion.email || ''}</li>
          <li>Phone: {lion.phone || ''}</li>
          <li>Website: {lion.website || ''}</li>
        </ul>
      </div>
      <div className="detail-section">
        <h4>관심 기술</h4>
        <ul style={{ paddingLeft: '20px', color: '#666' }}>
          {lion.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
      <div className="detail-section">
        <h4>한 마디</h4>
        <p>"{lion.motto || ''}"</p>
      </div>
    </article>
  );
}

export function DetailList({ lions }: DetailListProps) {
  return (
    <div id="detail-list" className="detail-list">
      {lions.map(lion => (
        <DetailCard key={lion.id} lion={lion} />
      ))}
    </div>
  );
}