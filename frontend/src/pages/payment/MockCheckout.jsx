import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MockCheckout = () => {
  const { tx_ref } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('telebirr');

  const handlePay = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(r => setTimeout(r, 1500));

      // Hit our backend webhook to confirm payment
      await axios.post('http://localhost:5000/api/payments/webhook', {
        tx_ref,
        status: 'SUCCESS'
      });

      alert('Payment Successful! Your booking is confirmed.');
      navigate('/my-bookings');
    } catch (err) {
      console.error(err);
      alert('Payment failed.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', fontFamily: 'Inter' }}>
      <div style={{ width: '100%', maxWidth: '450px', background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0, color: '#111827', fontSize: '1.5rem' }}>Secure Checkout</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '5px 0 0 0' }}>Transaction: {tx_ref}</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
          <button 
            onClick={() => setPaymentMethod('telebirr')}
            style={{ flex: 1, padding: '15px', border: paymentMethod === 'telebirr' ? '2px solid #00c2cb' : '1px solid #e5e7eb', background: paymentMethod === 'telebirr' ? '#f0fdfa' : 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: paymentMethod === 'telebirr' ? '#00c2cb' : '#4b5563', transition: '0.2s' }}
          >
            Telebirr
          </button>
          <button 
            onClick={() => setPaymentMethod('card')}
            style={{ flex: 1, padding: '15px', border: paymentMethod === 'card' ? '2px solid #2563eb' : '1px solid #e5e7eb', background: paymentMethod === 'card' ? '#eff6ff' : 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: paymentMethod === 'card' ? '#2563eb' : '#4b5563', transition: '0.2s' }}
          >
            Bank Card
          </button>
        </div>

        {paymentMethod === 'telebirr' && (
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#374151', fontWeight: 500 }}>Phone Number</label>
            <input type="text" placeholder="09XX XXX XXX" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none' }} />
          </div>
        )}

        {paymentMethod === 'card' && (
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#374151', fontWeight: 500 }}>Card Number</label>
            <input type="text" placeholder="XXXX XXXX XXXX XXXX" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none', marginBottom: '1rem' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#374151', fontWeight: 500 }}>Expiry</label>
                <input type="text" placeholder="MM/YY" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#374151', fontWeight: 500 }}>CVV</label>
                <input type="text" placeholder="123" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none' }} />
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={handlePay}
          disabled={loading}
          style={{ width: '100%', padding: '15px', background: paymentMethod === 'telebirr' ? '#00c2cb' : '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#9ca3af' }}>
          🔒 Protected by MockPay Secure Integration
        </p>
      </div>
    </div>
  );
};

export default MockCheckout;
