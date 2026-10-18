import React, { useState, useEffect } from 'react';
import API, { setToken } from './api';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Matches from './components/Matches';
import Subscribe from './components/Subscribe';

function App() {
  const [token, setLocalToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) {
      setToken(null);
      setUser(null);
      return;
    }

    setToken(token);
    API.get('/users/me').then(res => setUser(res.data)).catch(() => {
      localStorage.removeItem('token');
      setLocalToken(null);
    });
  }, [token]);

  const onLogin = ({ token, user }) => {
    localStorage.setItem('token', token);
    setLocalToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setLocalToken(null);
    setUser(null);
  };

  if (!token) {
    return (
      <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
        <h1>Yaari Dosti</h1>
        <p>Find meaningful connection.</p>
        <Login onLogin={onLogin} />
        <hr />
        <Register onRegister={onLogin} />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Yaari Dosti</h1>
        <button onClick={logout}>Logout</button>
      </div>
      <Profile user={user} setUser={setUser} />
      <Subscribe />
      <Matches me={user} />
    </div>
  );
}

export default App;
