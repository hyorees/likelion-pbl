import { useState, ChangeEvent, FormEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Lion, FormDataState } from '../types/lion';
import SummaryCard from '../components/SummaryCard';
import { supabase } from '../lib/supabase';

interface HomePageProps {
  lions: Lion[];
  loading: boolean;
  status: string;
  user: User | null;
  onAdd: (data: Omit<Lion, 'id'>) => Promise<void>;
  onDelete: () => Promise<void>;
  onRefetch: () => Promise<void>;
}

function HomePage({ lions, loading, status, user, onAdd, onDelete, onRefetch }: HomePageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const filterPart = searchParams.get('part') || '전체';
  const sortOrder = searchParams.get('sort') || 'newest';
  const searchName = searchParams.get('search') || '';

  const [formData, setFormData] = useState<FormDataState>({
    name: '', part: '', skills: '', oneLiner: '', intro: '', email: '', phone: '', website: '', motto: ''
  });

  const updateParams = (key: string, value: string, defaultValue: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === defaultValue) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    const field = id
      .replace('form-', '')
      .replace(/-([a-z])/g, (_, char) => char.toUpperCase()) as keyof FormDataState;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRandomFill = async () => {
    try {
      const res = await fetch('https://randomuser.me/api/?nat=us,gb,ca,au,nz');
      const data = await res.json();
      const u = data.results[0];
      setFormData({
        name: `${u.name.first} ${u.name.last}`,
        part: ["Frontend", "Backend", "Design"][Math.floor(Math.random() * 3)],
        skills: "TypeScript, React, Node.js",
        oneLiner: `${u.nat} · ${u.location.city}에서 합류했어요!`,
        intro: "Supabase 연동 과제를 수행 중인 아기사자입니다.",
        email: u.email,
        phone: u.phone,
        website: `https://example.com/${u.login.username}`,
        motto: "데이터베이스 영구 저장 성공!"
      });
    } catch (e) {
      alert("데이터를 가져오지 못했습니다.");
    }
  };

  const handleRandomAdd = async (count: number) => {
    if (!user) return;
    try {
      const res = await fetch(`https://randomuser.me/api/?results=${count}&nat=us,gb,ca,au,nz`);
      const data = await res.json();
      const results = data.results || [];

      for (const u of results) {
        await onAdd({
          name: `${u.name.first} ${u.name.last}`,
          part: ["Frontend", "Backend", "Design"][Math.floor(Math.random() * 3)],
          intro: "Supabase 연동 과제를 수행 중인 아기사자입니다.",
          email: u.email,
          phone: u.phone,
          website: `https://example.com/${u.login.username}`,
          skills: ["TypeScript", "React", "Node.js"],
          motto: "데이터베이스 영구 저장 성공!",
          oneLiner: `${u.nat} · ${u.location.city}에서 합류했어요!`,
          isMe: false
        });
      }
    } catch (e) {
      alert("랜덤 아기사자 데이터를 가져오는 데 실패했습니다.");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    await onAdd({
      name: formData.name,
      part: formData.part,
      intro: formData.intro,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
      motto: formData.motto,
      oneLiner: formData.oneLiner,
      isMe: false
    });
    setIsFormOpen(false);
    setFormData({ name: '', part: '', skills: '', oneLiner: '', intro: '', email: '', phone: '', website: '', motto: '' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const getFilteredAndSortedLions = (): Lion[] => {
    let result = [...lions];
    if (filterPart !== '전체') {
      result = result.filter(lion => lion.part === filterPart);
    }
    if (searchName) {
      result = result.filter(lion => lion.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (sortOrder === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  };

  const filteredLions = getFilteredAndSortedLions();

  return (
    <>
      <header className="auth-header" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px', padding: '10px 20px' }}>
        {user ? (
          <>
            <span className="user-email" style={{ fontWeight: '500', color: '#333' }}>{user.email}</span>
            <button onClick={handleLogout} style={{ padding: '6px 12px', background: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>로그아웃</button>
          </>
        ) : (
          <button onClick={() => navigate('/login')} style={{ padding: '6px 12px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>로그인</button>
        )}
      </header>

      <section className="control-section">
        {!user && (
          <div className="login-alert" style={{ background: '#e3f2fd', color: '#0d47a1', padding: '12px', borderRadius: '6px', marginBottom: '15px', textAlign: 'center', fontWeight: '500' }}>
            명단을 수정하려면 로그인이 필요합니다.
          </div>
        )}
        <div className="control-row">
          <div className="control-buttons">
            <button disabled={!user} onClick={() => setIsFormOpen(!isFormOpen)}>아기 사자 추가</button>
            <button disabled={!user} onClick={onDelete}>마지막 아기 사자 삭제</button>
          </div>
          <p className="count-text">총 <span>{lions.length}</span>명</p>
        </div>
        <hr />
        <div className="control-row">
          <div className="control-buttons">
            <button disabled={!user || loading} onClick={() => handleRandomAdd(1)}>랜덤 1명 추가</button>
            <button disabled={!user || loading} onClick={() => handleRandomAdd(5)}>랜덤 5명 추가</button>
            <button disabled={loading} onClick={onRefetch}>전체 새로고침</button>
          </div>
          <div className="status-group">
            <span className="count-text">{status}</span>
          </div>
        </div>
      </section>

      <section className="control-section" style={{ marginTop: '0', marginBottom: '30px' }}>
        <div className="control-row">
          <div className="option-item">
            <label>파트</label>
            <select value={filterPart} onChange={(e) => updateParams('part', e.target.value, '전체')}>
              <option value="전체">전체</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Design">Design</option>
            </select>
          </div>
          <div className="option-item">
            <label>정렬</label>
            <select value={sortOrder} onChange={(e) => updateParams('sort', e.target.value, 'newest')}>
              <option value="newest">최신추가순</option>
              <option value="name">이름순</option>
            </select>
          </div>
          <div className="option-item search-box">
            <label>검색</label>
            <input 
              type="text" 
              placeholder="이름으로 검색" 
              value={searchName}
              onChange={(e) => updateParams('search', e.target.value, '')}
            />
          </div>
        </div>
      </section>

      {user && (
        <section className={`form-section ${isFormOpen ? '' : 'hidden'}`}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" id="form-name" placeholder="이름" required value={formData.name} onChange={handleInputChange} />
              <select id="form-part" required value={formData.part} onChange={handleInputChange}>
                <option value="">파트 선택</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Design">Design</option>
              </select>
            </div>
            <input type="text" id="form-skills" placeholder="관심 기술 (쉼표로 구분)" value={formData.skills} onChange={handleInputChange} />
            <input type="text" id="form-one-liner" placeholder="한 줄 소개" value={formData.oneLiner} onChange={handleInputChange} />
            <textarea id="form-intro" placeholder="자기소개" value={formData.intro} onChange={handleInputChange}></textarea>
            <div className="form-group">
              <input type="email" id="form-email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
              <input type="tel" id="form-phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            <input type="text" id="form-website" placeholder="Website" value={formData.website} onChange={handleInputChange} />
            <input type="text" id="form-motto" placeholder="한 마디" value={formData.motto} onChange={handleInputChange} />
            <div className="form-btns" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={handleRandomFill}>랜덤 값 채우기</button>
              <button type="submit">추가하기</button>
              <button type="button" onClick={() => setIsFormOpen(false)}>취소</button>
            </div>
          </form>
        </section>
      )}

      <section className="summary-section">
        {loading ? (
          <p className="count-text">로딩 중...</p>
        ) : (
          <div className="summary-grid">
            {filteredLions.map(lion => (
              <div key={lion.id} onClick={() => navigate(`/lions/${lion.id}`)} style={{ cursor: 'pointer' }}>
                <SummaryCard lion={lion} />
              </div>
            ))}
          </div>
        )}
        {!loading && filteredLions.length === 0 && (
          <p className="count-text">표시할 아기 사자가 없습니다.</p>
        )}
      </section>
    </>
  );
}

export default HomePage;