import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Stores(){
  const [q,setQ] = useState('');
  const [data,setData] = useState([]);
  const [sort,setSort] = useState('name');
  const [order,setOrder] = useState('asc');

  const load = async ()=>{
    const { data } = await api.get('/stores', { params: { q, sort, order, limit: 20, offset: 0 } });
    setData(data);
  }
  useEffect(()=>{ load() }, [sort, order]);

  const rate = async (id, value) => {
    await api.post(`/stores/${id}/ratings`, { rating: Number(value) });
    load();
  }

  return (
    <div>
      <h3>All Stores</h3>
      <div style={{display:'flex', gap:8, marginBottom:10}}>
        <input placeholder="Search name/address" value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={()=>load()}>Search</button>
        <select value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
        </select>
        <select value={order} onChange={e=>setOrder(e.target.value)}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>
      <table width="100%" cellPadding="6" style={{borderCollapse:'collapse'}}>
        <thead><tr>
          <th align="left">Name</th>
          <th align="left">Address</th>
          <th align="center">Overall</th>
          <th align="center">Your Rating</th>
          <th align="center">Action</th>
        </tr></thead>
        <tbody>
          {data.map(s => (
            <tr key={s.id} style={{borderTop:'1px solid #ddd'}}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td align="center">{s.overall_rating}</td>
              <td align="center">{s.user_rating ?? '-'}</td>
              <td align="center">
                <select defaultValue={s.user_rating || ''} onChange={e=>rate(s.id, e.target.value)}>
                  <option value="" disabled>Rate</option>
                  {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
