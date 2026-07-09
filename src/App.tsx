import { Routes, Route } from 'react-router-dom';
import './styles/style.css';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';
import { useLions } from './hooks/useLions';
import { useAuth } from './hooks/useAuth';

function App() {
  const { lions, loading, status, addLion, deleteLastLion, refetch } = useLions();
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p className="count-text">인증 상태를 확인하고 있습니다...</p>
      </div>
    );
  }

  return (
    <main className="dashboard">
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              lions={lions} 
              loading={loading}
              status={status}
              user={user}
              onAdd={addLion}
              onDelete={deleteLastLion}
              onRefetch={refetch}
            />
          } 
        />
        <Route path="/lions/:id" element={<DetailPage lions={lions} />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </main>
  );
}

export default App;