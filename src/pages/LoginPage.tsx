import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function LoginPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('비밀번호는 최소 6자리 이상이어야 합니다.');
      return;
    }

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        if (error.status === 422 || error.message.includes('already registered')) {
          setErrorMsg('이미 존재하는 이메일 계정입니다.');
        } else {
          setErrorMsg(error.message);
        }
      } else {
        alert('회원가입이 완료되었습니다. 로그인해 주세요.');
        setIsSignUp(false);
        setPassword('');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#1a237e', marginBottom: '8px' }}>Lion Track</h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '25px' }}>아기사자 명단 관리 시스템</p>
      <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>{isSignUp ? '회원가입' : '로그인'}</h3>
      
      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label htmlFor="auth-email" style={{ fontSize: '14px', fontWeight: '500' }}>이메일</label>
          <input type="email" id="auth-email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label htmlFor="auth-password" style={{ fontSize: '14px', fontWeight: '500' }}>비밀번호</label>
          <input type="password" id="auth-password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        {errorMsg && (
          <p className="error-text" style={{ color: '#d32f2f', fontSize: '13px', margin: '5px 0 0 0', fontWeight: '500' }}>{errorMsg}</p>
        )}

        <button type="submit" style={{ padding: '12px', background: '#1a237e', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
          {isSignUp ? '가입하기' : '로그인'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        {isSignUp ? (
          <span style={{ color: '#666' }}>이미 계정이 있으신가요? <button onClick={() => { setIsSignUp(false); setErrorMsg(''); }} style={{ background: 'none', border: 'none', color: '#1a237e', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>로그인</button></span>
        ) : (
          <span style={{ color: '#666' }}>아직 회원이 아니신가요? <button onClick={() => { setIsSignUp(true); setErrorMsg(''); }} style={{ background: 'none', border: 'none', color: '#1a237e', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>회원가입</button></span>
        )}
      </div>
    </div>
  );
}

export default LoginPage;