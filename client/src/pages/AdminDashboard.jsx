import React, { useEffect, useState } from 'react';
import api from '../api';

export default function AdminDashboard(){
  const [cards,setCards] = useState({ totalUsers:0, totalStores:0, totalRatings:0 });
  const [users,setUsers] = useState([]);
  const [stores,setStores] = useState([]);
  const [qUsers,setQUsers] = useState('');
  const [qStores,setQStores] = useState('');

  useEffect(()=>{
    api.get('/admin/dashboard').then(({data})=>setCards(data));
    api.get('/admin/users').then(({data})=>setUsers(data));
    api.get('/admin/stores').then(({data})=>setStores(data));
  },[]);

  const searchUsers = async ()=>{
    const { data } = await api.get('/admin/users', { params:{ q: qUsers } });
    setUsers(data);
  }
  const searchStores = async ()=>{
    const { data } = await api.get('/admin/stores', { params:{ q: qStores } });
    setStores(data);
  }

  return (
    <div>
      <h3>Admin Dashboard</h3>
      <div style={{display:'flex', gap:12, margin:'10px 0'}}>
        <Card title="Users" value={cards.totalUsers} />
        <Card title="Stores" value={cards.totalStores} />
        <Card title="Ratings" value={cards.totalRatings} />
      </div>

      <h4>Users</h4>
      <div style={{display:'flex', gap:8}}>
        <input placeholder="Filter users" value={qUsers} onChange={e=>setQUsers(e.target.value)} />
        <button onClick={searchUsers}>Search</button>
      </div>
      <table width="100%" cellPadding="6" style={{borderCollapse:'collapse', marginTop:8}}>
        <thead><tr><th align="left">Name</th><th>Email</th><th>Address</th><th>Role</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{borderTop:'1px solid #ddd'}}>
              <td>{u.name}</td><td>{u.email}</td><td>{u.address}</td><td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={{marginTop:20}}>Stores</h4>
      <div style={{display:'flex', gap:8}}>
        <input placeholder="Filter stores" value={qStores} onChange={e=>setQStores(e.target.value)} />
        <button onClick={searchStores}>Search</button>
      </div>
      <table width="100%" cellPadding="6" style={{borderCollapse:'collapse', marginTop:8}}>
        <thead><tr><th align="left">Name</th><th>Email</th><th>Address</th><th>Rating</th></tr></thead>
        <tbody>
          {stores.map(s => (
            <tr key={s.id} style={{borderTop:'1px solid #ddd'}}>
              <td>{s.name}</td><td>{s.email}</td><td>{s.address}</td><td>{s.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Card({title, value}){
  return (
    <div style={{padding:12, border:'1px solid #ddd', borderRadius:8, minWidth:120}}>
      <div style={{fontSize:12, color:'#666'}}>{title}</div>
      <div style={{fontSize:20, fontWeight:600}}>{value}</div>
    </div>
  )
}
