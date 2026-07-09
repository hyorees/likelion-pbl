import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/style.css';
import { initialLions } from './data/lions';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';
import { Lion } from './types/lion';
import { RandomUserResponse } from './types/api';

function App() {
  const [lions, setLions] = useState<Lion[]>([]);
  const [apiStatus, setApiStatus] = useState<string>('준비 완료');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    setLions(initialLions);
  }, []);

  const handleDeleteLast = () => {
    if (lions.length > 1) {
      setLions(lions.slice(0, -1));
    }
  };

  const fetchAPI = async (count: number, isRefresh: boolean = false): Promise<void> => {
    setLastAction(() => () => fetchAPI(count, isRefresh));
    setIsPending(true);
    setHasError(false);
    setApiStatus('불러오는 중...');

    try {
      const res = await fetch(`https://randomuser.me/api/?results=${count}&nat=us,gb,ca,au,nz`);
      if (!res.ok) throw new Error();
      const data = (await res.json()) as RandomUserResponse;
      
      const newOnes: Lion[] = data.results.map((u) => ({
        id: String(Date.now() + Math.random()),
        name: `${u.name.first} ${u.name.last}`,
        part: ["Frontend", "Backend", "Design"][Math.floor(Math.random() * 3)],
        intro: "비동기 데이터를 활용해 UI를 구성하는 연습 중입니다.",
        email: u.email,
        phone: u.phone,
        website: `https://example.com/${u.login.username}`,
        skills: ["JavaScript", "React", "HTML/CSS"],
        motto: "데이터가 바뀌면 UI도 바뀐다!",
        oneLiner: `${u.nat} · ${u.location.city}에서 합류했어요!`,
        isMe: false
      }));

      if (isRefresh) {
        setLions([lions[0], ...newOnes]);
      } else {
        setLions([...lions, ...newOnes]);
      }
      setApiStatus('준비 완료');
    } catch (e) {
      setApiStatus('요청 실패');
      setHasError(true);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="dashboard">
      <Routes>
        <Route 
          path="/" 
          element={
            <ListPage 
              lions={lions} 
              setLions={setLions}
              apiStatus={apiStatus}
              isPending={isPending}
              hasError={hasError}
              onFetch={fetchAPI}
              onDeleteLast={handleDeleteLast}
              onRetry={() => lastAction && lastAction()}
            />
          } 
        />
        <Route path="/lions/:id" element={<DetailPage lions={lions} />} />
      </Routes>
    </main>
  );
}

export default App;