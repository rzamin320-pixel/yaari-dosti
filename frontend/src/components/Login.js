import React, { useState } from 'react';
import API from '../api';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      onLogin(res.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
      <h3>Login</h3>
      <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
      <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
      <button type="submit">Login</button>
    </form>
  );
}
