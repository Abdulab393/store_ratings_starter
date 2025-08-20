import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Signup(){
  const [form,setForm] = useState({ name:'', email:'', address:'', password:'' });
  const [errors,setErrors] = useState([]);
  const nav = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    setErrors([]);
    try {
      const { data } = await api.post('/auth/signup', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      nav('/stores');
    } catch (e) {
      setErrors(e?.response?.data?.errors || [e?.response?.data?.error || 'Signup failed']);
    }
  }

  return (
    <form onSubmit={submit} style={{display:'grid', gap:10, maxWidth:480}}>
      <h3>Signup</h3>
      {errors.length>0 && <div style={{color:'crimson'}}>{errors.join(', ')}</div>}
      <input placeholder="Full name (20–60 chars)" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
      <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
      <input placeholder="Address (<=400 chars)" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
      <input placeholder="Password (8–16, 1 uppercase & special)" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
      <button>Create account</button>
    </form>
  )
}
