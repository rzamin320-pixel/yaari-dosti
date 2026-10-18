import React, { useState } from 'react';
import API from '../api';

export default function Register({ onRegister }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', interests: '' });

  const submit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        interests: form.interests ? form.interests.split(',').map(s => s.trim()) : []
      };
      const res = await API.post('/auth/register', payload);
      onRegister(res.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
      <h3>Register</h3>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
      <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
      <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
      <input placeholder="Interests (comma separated)" value={form.interests} onChange={e => setForm({ ...form, interests: e.target.value })} />
      <button type="submit">Register</button>
    </form>
  );
}
