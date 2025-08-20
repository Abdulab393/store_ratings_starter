import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const nav = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      nav('/stores');
    } catch (e) {
      setError(e?.response?.data?.error || 'Login failed');
    }
  }

  return (
    <form onSubmit={submit} style={{display:'grid', gap:10, maxWidth:400}}>
      <h3>Login</h3>
      {error && <div style={{color:'crimson'}}>{error}</div>}
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  )
}
