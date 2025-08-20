import React, { useEffect, useState } from 'react';
import api from '../api';

export default function OwnerDashboard(){
  const [avg,setAvg] = useState({ averageRating:0, ratingCount:0 });
  const [rows,setRows] = useState([]);

  useEffect(()=>{
    api.get('/owner/store/average').then(({data})=>setAvg(data));
    api.get('/owner/store/ratings').then(({data})=>setRows(data));
  },[]);

  return (
    <div>
      <h3>Owner Dashboard</h3>
      <div style={{display:'flex', gap:12, margin:'10px 0'}}>
        <Card title="Average Rating" value={avg.averageRating} />
        <Card title="Rating Count" value={avg.ratingCount} />
      </div>
      <table width="100%" cellPadding="6" style={{borderCollapse:'collapse'}}>
        <thead><tr><th align="left">User</th><th>Email</th><th>Rating</th><th>Date</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} style={{borderTop:'1px solid #ddd'}}>
              <td>{r.name}</td><td>{r.email}</td><td>{r.rating}</td><td>{new Date(r.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Card({title, value}){
  return (
    <div style={{padding:12, border:'1px solid #ddd', borderRadius:8, minWidth:160}}>
      <div style={{fontSize:12, color:'#666'}}>{title}</div>
      <div style={{fontSize:20, fontWeight:600}}>{value}</div>
    </div>
  )
}
