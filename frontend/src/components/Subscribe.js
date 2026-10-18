import React from 'react';
import API from '../api';

export default function Subscribe() {
  const startSubscription = async () => {
    try {
      const res = await API.post('/payments/create-checkout-session', {});
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert('No checkout URL returned');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Subscription failed');
    }
  };

  return (
    <div style={{ marginTop: 20, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
      <h3>Premium Subscription</h3>
      <p>Unlock premium match visibility and exclusive features.</p>
      <button onClick={startSubscription}>Subscribe</button>
    </div>
  );
}
