import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Matches() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    API.get('/matches').then(res => setMatches(res.data)).catch(() => {});
  }, []);

  return (
    <div style={{ marginTop: 20, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
      <h3>Suggested matches</h3>
      {matches.length === 0 ? <p>No matches yet.</p> : matches.map(item => (
        <div key={item.user._id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 10, borderRadius: 8 }}>
          <strong>{item.user.name}</strong>
          <p>{item.user.bio || 'No bio yet'}</p>
          <small>Shared interests: {item.score}</small>
        </div>
      ))}
    </div>
  );
}
