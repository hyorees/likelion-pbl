import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lion, FormDataState } from '../types/lion';
import { RandomUserResponse } from '../types/api';
import SummaryCard from '../components/SummaryCard';
import { supabase } from '../lib/supabase';

interface ListPageProps {
  lions: Lion[];
  setLions: React.Dispatch<React.SetStateAction<Lion[]>>;
  apiStatus: string;
  isPending: boolean;
  hasError: boolean;
  onFetch: (count: number, isRefresh?: boolean) => Promise<void>;
  onDeleteLast: () => void;
  onRetry: () => void;
  isLoggedIn: boolean; 
  onAdd: (lionData: Omit<Lion, 'id'>) => Promise<void>;
}

function ListPage({ 
  lions, 
  setLions, 
  apiStatus, 
  isPending, 
  hasError, 
  onFetch, 
  onDeleteLast, 
  onRetry,
  isLoggedIn,
  onAdd
}: ListPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const filterPart = searchParams.get('part') || '전체';
  const sortOrder = searchParams.get('sort') || 'newest';
  const searchName = searchParams.get('search') || '';

  const [formData, setFormData] = useState<FormDataState>({
    name: '', part: '', skills: '', oneLiner: '', intro: '', email: '', phone: '', website: '', motto: ''
  });

  useEffect(() => {
    const fetchLionsRealtime = async () => {
      const { data, error } = await supabase
        .from('lions')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data) {
        const mappedLions: Lion[] = data.map((d: any) => ({
          id: String(d.id),
          name: d.name,
          part: d.part,
          oneLiner: d.description || '',
          intro: d.introduction || '',
          skills: d.tech_stack ? d.tech_stack.split(',').map((s: string) => s.trim()) : [],
          email: d.email || '',
          phone: d.phone || '',
          website: d.website || '',
          motto: d.motto || '',
          isMe: false
        }));
        setLions(mappedLions);
      }
    };
    fetchLionsRealtime();
  }, [setLions]);

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
      const data = (await res.json()) as RandomUserResponse;
      const u = data.results[0];
      setFormData({
        name: `${u.name.first} ${u.name.last}`,
        part: ["Frontend", "Backend", "Design"][Math.floor(Math.random() * 3)],
        skills: "JavaScript, React, HTML/CSS",
        oneLiner: `${u.nat.toUpperCase()} · ${u.location.city}에서 합류했어요!`,
        intro: "비동기 데이터를 활용해 UI를 구성하는 연습 중입니다.",
        email: u.email,
        phone: u.phone,
        website: `https://example.com/${u.login.username}`,
        motto: "데이터가 바뀌면 UI도 바뀐다!"
      });
    } catch (e) {
      alert("랜덤 데이터를 가져오지 못했습니다.");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newLionData = {
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
    };

    onAdd(newLionData); 
    
    setIsFormOpen(false);
    setFormData({ name: '', part: '', skills: '', oneLiner: '', intro: '', email: '', phone: '', website: '', motto: '' });
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
      <section className="control-section">
        {/* 상단 레이아웃: 추가하기/삭제하기는 로그인 시에만 작동 허용 */}
        <div className="control-row">
          <div className="control-buttons">
            <button onClick={() => setIsFormOpen(!isFormOpen)} disabled={!isLoggedIn}>
              아기 사자 추가
            </button>
            <button onClick={onDeleteLast} disabled={!isLoggedIn}>
              마지막 아기 사자 삭제
            </button>
          </div>
          <p className="count-text">총 <span id="total-count">{lions.length}</span>명</p>
        </div>
        <hr />
        {/* 하단 레이아웃: 과제 요구사항에 따른 랜덤 생성 및 새로고침 항시 노출 */}
        <div className="control-row">
          <div className="control-buttons">
            <button disabled={isPending} onClick={() => onFetch(1)}>랜덤 1명 추가</button>
            <button disabled={isPending} onClick={() => onFetch(5)}>랜덤 5명 추가</button>
            <button disabled={isPending} onClick={() => onFetch(lions.length - 1, true)}>전체 새로고침</button>
          </div>
          <div className="status-group">
            <span className="count-text">{apiStatus}</span>
            {hasError && <button onClick={onRetry}>재시도</button>}
          </div>
        </div>
      </section>

      {/* 필터 및 검색 바 섹션 */}
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

      {/* 입력 폼 섹션 */}
      <section className={`form-section ${isFormOpen ? '' : 'hidden'}`}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" id="form-name" placeholder="이름" value={formData.name} onChange={handleInputChange} required />
            <select id="form-part" value={formData.part} onChange={handleInputChange} required>
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

      {/* 카드 리스트 격자 섹션 */}
      <section className="summary-section">
        <div className="summary-grid">
          {filteredLions.map(lion => (
            <div key={lion.id} onClick={() => navigate(`/lions/${lion.id}`)} style={{ cursor: 'pointer' }}>
              <SummaryCard lion={lion} />
            </div>
          ))}
        </div>
        {filteredLions.length === 0 && (
          <p className="count-text">표시할 아기 사자가 없습니다. (필터/검색 조건을 확인해 주세요)</p>
        )}
      </section>
    </>
  );
}

export default ListPage;