import { Lion } from '../types/lion';
import { Database } from '../types/database';

type LionRow = Database['public']['Tables']['lions']['Row'];
type LionInsert = Database['public']['Tables']['lions']['Insert'];

export function mapRowToLion(row: LionRow): Lion {
  return {
    id: String(row.id),
    name: row.name || '',
    part: row.part || 'Frontend',
    intro: row.introduction || '',
    email: '',
    phone: '',
    website: row.github || '',
    skills: row.tech_stack ? row.tech_stack.split(',').map((s: string) => s.trim()) : [],
    motto: '',
    oneLiner: row.description || '',
    isMe: false
  };
}

export function mapLionToInsert(lion: Omit<Lion, 'id'>): LionInsert {
  return {
    name: lion.name,
    gender: 'male',
    track: lion.part || '기획/디자인',
    part: lion.part,
    github: lion.website || '',
    description: lion.oneLiner || lion.motto || '',
    introduction: lion.intro || '',
    tech_stack: Array.isArray(lion.skills) ? lion.skills.join(', ') : lion.skills || ''
  };
}