import React, { useState } from 'react';
import api from '../api';

export default function ChangePassword(){
  const [currentPassword,setC] = useState('');
  const [newPassword,setN] = useState('');
  const [msg,setMsg] = useState('');
  const submit = async (e)=>{
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      setMsg('Password updated.');
      setC(''); setN('');
    } catch (e) { setMsg(e?.response?.data?.error || 'Failed'); }
  }
  return (
    <form onSubmit={submit} style={{display:'grid', gap:10, maxWidth:400}}>
      <h3>Change Password</h3>
      {msg && <div>{msg}</div>}
      <input placeholder="Current password" type="password" value={currentPassword} onChange={e=>setC(e.target.value)} />
      <input placeholder="New password" type="password" value={newPassword} onChange={e=>setN(e.target.value)} />
      <button>Update</button>
    </form>
  )
}
