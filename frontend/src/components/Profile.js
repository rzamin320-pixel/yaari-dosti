import React, { useState } from 'react';
import API from '../api';

export default function Profile({ user, setUser }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: user?.bio || '', interests: user?.interests || [] });

  const save = async () => {
    try {
      const res = await API.put('/users/me', { bio: form.bio, interests: form.interests });
      setUser(res.data);
      setEditing(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Save failed');
    }
  };

  const uploadPhoto = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('photo', file);
    try {
      const res = await API.post('/users/me/photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser(prev => ({ ...prev, photos: [...(prev.photos || []), res.data.photo] }));
    } catch (error) {
      alert(error.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div style={{ marginTop: 20, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
      <h3>Profile</h3>
      {!editing ? (
        <div>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Bio:</strong> {user?.bio || 'No bio yet'}</p>
          <p><strong>Interests:</strong> {(user?.interests || []).join(', ') || 'None'}</p>
          <button onClick={() => setEditing(true)}>Edit profile</button>
          <div style={{ marginTop: 12 }}>
            <input type="file" onChange={uploadPhoto} />
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
              {(user?.photos || []).map((photo, index) => (
                <img key={index} src={photo} alt="user photo" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10 }} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Bio" rows={3} />
          <input value={form.interests.join(', ')} onChange={e => setForm({ ...form, interests: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="Interests separated by commas" />
          <button onClick={save}>Save</button>
        </div>
      )}
    </div>
  );
}
