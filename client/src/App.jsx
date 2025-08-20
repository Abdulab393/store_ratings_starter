import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'

function isAuthed() { return !!localStorage.getItem('token') }
function role() { return localStorage.getItem('role') }

export default function App() {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.clear(); navigate('/login')
  }
  return (
    <div style={{maxWidth: 900, margin: '20px auto', fontFamily: 'system-ui, sans-serif'}}>
      <header style={{display:'flex', gap:12, alignItems:'center', marginBottom: 20}}>
        <h2 style={{marginRight:'auto'}}>Store Ratings</h2>
        <Link to="/stores">Stores</Link>
        {role()==='ADMIN' && <Link to="/admin">Admin</Link>}
        {role()==='OWNER' && <Link to="/owner">Owner</Link>}
        {isAuthed() ? <>
          <Link to="/profile/change-password">Change Password</Link>
          <button onClick={logout}>Logout</button>
        </> : <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>}
      </header>
      <Outlet />
    </div>
  )
}
