import { Lion } from '../types/lion';

interface SummaryCardProps {
  lion: Lion;
}

function SummaryCard({ lion }: SummaryCardProps) {
  return (
    <article className={`card-summary ${lion.isMe ? 'me' : ''}`}>
      <div className="image-wrapper">
        <img 
          src={lion.isMe ? "/media/girl1.png" : `https://api.dicebear.com/7.x/avataaars/svg?seed=${lion.name}`} 
          alt={lion.name} 
        />
        <span className="badge">{lion.skills[0] || 'Tech'}</span>
      </div>
      <div className="card-content">
        <h3 className="name">{lion.name}</h3>
        <p className="part">{lion.part}</p>
        <p className="one-liner">{lion.oneLiner || ''}</p>
      </div>
    </article>
  );
}

export default SummaryCard;