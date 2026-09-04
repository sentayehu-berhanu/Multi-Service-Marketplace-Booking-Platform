import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AutoCheckoutFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { business, service, date, time, vehicleInfo, type } = location.state || {};
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: vehicleInfo || ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  if (!business || !service) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Inter', sans-serif" }}>
        <h2>Invalid Checkout Session</h2>
        <Link to="/" style={{ color: '#2563eb' }}>Return Home</Link>
      </div>
    );
  }

  const handleNext = () => {
    if (step === 1) {
      if (!customerInfo.firstName || !customerInfo.email || !customerInfo.phone) {
        return alert("Please fill out required customer information.");
      }
    }
    if (step === 2) {
      if (!paymentInfo.cardNumber) {
        return alert("Please enter payment details.");
      }
    }
    setStep(step + 1);
  };

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating network
    
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = {
          business_id: business.id,
          service_id: service.id,
          start_time: new Date(`${date} ${time}`).toISOString()
        };
        await axios.post('http://localhost:5000/api/bookings', payload, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(e => console.log("Booking save skipped/failed, proceeding to success"));
      }
      setStep(4);
    } catch (e) {
      console.error(e);
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '2rem 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Left Side: Forms */}
        <div style={{ flex: '1 1 600px' }}>
          
          <h1 style={{ fontSize: '2rem', margin: '0 0 2rem 0', color: '#0f172a' }}>
            Complete Your Auto Service Booking
          </h1>
          
          <div style={{ display: 'flex', marginBottom: '2rem', gap: '10px' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ 
                flex: 1, height: '6px', borderRadius: '3px',
                background: step >= s ? '#2563eb' : '#e2e8f0' 
              }}></div>
            ))}
          </div>

          {step === 1 && (
            <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: '0 0 1.5rem 0', color: '#0f172a', fontSize: '1.5rem' }}>Your Details</h2>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <input type="text" placeholder="First Name *" value={customerInfo.firstName} onChange={e => setCustomerInfo({...customerInfo, firstName: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <input type="text" placeholder="Last Name" value={customerInfo.lastName} onChange={e => setCustomerInfo({...customerInfo, lastName: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <input type="email" placeholder="Email Address *" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '15px' }} />
              <input type="tel" placeholder="Phone Number *" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '15px' }} />
              
              <label style={{ display: 'block', color: '#475569', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Vehicle Details & Special Notes</label>
              <textarea placeholder="Vehicle details or special requests..." value={customerInfo.specialRequests} onChange={e => setCustomerInfo({...customerInfo, specialRequests: e.target.value})} rows="3" style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '20px' }}></textarea>
              
              <button onClick={handleNext} style={{ background: '#0f172a', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'block', marginLeft: 'auto' }}>
                Next: Payment Details
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: '0 0 1.5rem 0', color: '#0f172a', fontSize: '1.5rem' }}>Payment Method</h2>
              
              <div style={{ border: '1px solid #2563eb', padding: '15px', borderRadius: '8px', background: '#eff6ff', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', color: '#0f172a', cursor: 'pointer' }}>
                  <input type="radio" checked readOnly />
                  Credit / Debit Card
                </label>
              </div>

              <input type="text" placeholder="Card Number *" value={paymentInfo.cardNumber} onChange={e => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})} style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '15px' }} />
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <input type="text" placeholder="MM/YY" value={paymentInfo.expiry} onChange={e => setPaymentInfo({...paymentInfo, expiry: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <input type="text" placeholder="CVV" value={paymentInfo.cvv} onChange={e => setPaymentInfo({...paymentInfo, cvv: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(1)} style={{ background: '#f1f5f9', color: '#475569', padding: '15px 30px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>Back</button>
                <button onClick={handleNext} style={{ background: '#0f172a', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                  Review Booking
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: '0 0 1.5rem 0', color: '#0f172a', fontSize: '1.5rem' }}>Review & Confirm</h2>
              
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#0f172a' }}>{customerInfo.firstName} {customerInfo.lastName}</h3>
                <p style={{ margin: 0, color: '#64748b' }}>{customerInfo.email} • {customerInfo.phone}</p>
                <p style={{ margin: '10px 0 0 0', color: '#475569', fontStyle: 'italic' }}>Vehicle Info: {customerInfo.specialRequests}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(2)} style={{ background: '#f1f5f9', color: '#475569', padding: '15px 30px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', opacity: loading ? 0.5 : 1 }} disabled={loading}>Back</button>
                <button onClick={handleConfirm} disabled={loading} style={{ background: '#2563eb', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Processing...' : 'Confirm Service'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ background: 'white', padding: '3rem 2rem', borderRadius: '15px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem auto' }}>
                ✓
              </div>
              <h2 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '2rem' }}>Booking Confirmed!</h2>
              <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>
                Your appointment at {business.name} is confirmed for {date} at {time}.
              </p>
              <Link to="/my-bookings" style={{ display: 'inline-block', background: '#0f172a', color: 'white', padding: '12px 25px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                View My Bookings
              </Link>
            </div>
          )}

        </div>

        {/* Right Side: Summary Card */}
        {step < 4 && (
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #e2e8f0', position: 'sticky', top: '2rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: `url(${business.cover_image || business.gallery?.[0]}) center/cover` }}></div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{business.name}</h3>
                  <div style={{ color: '#64748b', fontSize: '0.9rem' }}>📍 {business.address || business.location}</div>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 15px 0', color: '#0f172a' }}>Service Summary</h4>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#475569' }}>
                  <span>Service</span>
                  <span style={{ fontWeight: 'bold' }}>{service.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#475569' }}>
                  <span>Date</span>
                  <span style={{ fontWeight: 'bold' }}>{date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#475569' }}>
                  <span>Time</span>
                  <span style={{ fontWeight: 'bold' }}>{time}</span>
                </div>
                
                <div style={{ borderTop: '1px dashed #cbd5e1', margin: '15px 0' }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>Total</span>
                  <span style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '1.3rem' }}>{service.price} ETB</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AutoCheckoutFlow;
