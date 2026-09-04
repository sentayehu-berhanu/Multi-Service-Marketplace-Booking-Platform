import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RestaurantCheckoutFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract state from location
  const { business, cart, table, date, time, guests, type } = location.state || {};
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'telebirr',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  if (!business || !type) {
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
      if (paymentInfo.method === 'card' && !paymentInfo.cardNumber) {
        return alert("Please enter payment details.");
      }
    }
    setStep(step + 1);
  };

  const handleConfirm = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const token = localStorage.getItem('token');
      // For real booking API, would post to /api/bookings here
      if (token) {
        const payload = {
          business_id: business.id,
          service_id: type === 'reservation' && table ? table.id : 1, // Fallback service ID
          start_time: type === 'reservation' ? new Date(`${date} ${time}`).toISOString() : new Date().toISOString()
        };
        await axios.post('http://localhost:5000/api/bookings', payload, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(e => console.log("Booking save skipped/failed, proceeding to success screen"));
      }
      
      setStep(4); // Success step
    } catch (e) {
      console.error(e);
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = type === 'order' ? cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;
  const grandTotal = cartTotal + (cartTotal > 0 ? 50 : 0); // Add 50 delivery/service fee if food

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '2rem 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Left Side: Flow Forms */}
        <div style={{ flex: '1 1 600px' }}>
          
          <h1 style={{ fontSize: '2rem', margin: '0 0 2rem 0', color: '#0f172a' }}>
            {type === 'order' ? 'Complete Your Food Order' : 'Complete Table Reservation'}
          </h1>
          
          {/* Progress Bar */}
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
              
              <textarea placeholder={type === 'order' ? "Delivery instructions or allergies?" : "Special requests (e.g., high chair)?"} value={customerInfo.specialRequests} onChange={e => setCustomerInfo({...customerInfo, specialRequests: e.target.value})} rows="3" style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '20px' }}></textarea>
              
              <button onClick={handleNext} style={{ background: '#0f172a', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'block', marginLeft: 'auto' }}>
                Next: Payment Details
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: '0 0 1.5rem 0', color: '#0f172a', fontSize: '1.5rem' }}>Payment Method</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                <div onClick={() => setPaymentInfo({...paymentInfo, method: 'card'})} style={{ border: paymentInfo.method === 'card' ? '2px solid #3b82f6' : '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', background: paymentInfo.method === 'card' ? '#eff6ff' : 'white', cursor: 'pointer' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', color: paymentInfo.method === 'card' ? '#1e3a8a' : '#475569', cursor: 'pointer' }}>
                    <input type="radio" checked={paymentInfo.method === 'card'} readOnly /> 💳 Credit / Debit Card
                  </label>
                </div>
                <div onClick={() => setPaymentInfo({...paymentInfo, method: 'telebirr'})} style={{ border: paymentInfo.method === 'telebirr' ? '2px solid #3b82f6' : '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', background: paymentInfo.method === 'telebirr' ? '#eff6ff' : 'white', cursor: 'pointer' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', color: paymentInfo.method === 'telebirr' ? '#1e3a8a' : '#475569', cursor: 'pointer' }}>
                    <input type="radio" checked={paymentInfo.method === 'telebirr'} readOnly /> 📱 Telebirr
                  </label>
                </div>
                <div onClick={() => setPaymentInfo({...paymentInfo, method: 'cbebirr'})} style={{ border: paymentInfo.method === 'cbebirr' ? '2px solid #3b82f6' : '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', background: paymentInfo.method === 'cbebirr' ? '#eff6ff' : 'white', cursor: 'pointer' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', color: paymentInfo.method === 'cbebirr' ? '#1e3a8a' : '#475569', cursor: 'pointer' }}>
                    <input type="radio" checked={paymentInfo.method === 'cbebirr'} readOnly /> 🏦 CBE Birr
                  </label>
                </div>
                <div onClick={() => setPaymentInfo({...paymentInfo, method: 'cash'})} style={{ border: paymentInfo.method === 'cash' ? '2px solid #3b82f6' : '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', background: paymentInfo.method === 'cash' ? '#eff6ff' : 'white', cursor: 'pointer' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', color: paymentInfo.method === 'cash' ? '#1e3a8a' : '#475569', cursor: 'pointer' }}>
                    <input type="radio" checked={paymentInfo.method === 'cash'} readOnly /> 💵 Cash on Delivery
                  </label>
                </div>
              </div>

              {paymentInfo.method === 'card' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <input type="text" placeholder="Card Number *" value={paymentInfo.cardNumber} onChange={e => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})} style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '15px' }} />
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <input type="text" placeholder="MM/YY" value={paymentInfo.expiry} onChange={e => setPaymentInfo({...paymentInfo, expiry: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    <input type="text" placeholder="CVV" value={paymentInfo.cvv} onChange={e => setPaymentInfo({...paymentInfo, cvv: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </div>
                </div>
              )}
              
              {paymentInfo.method === 'telebirr' && (
                <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px', marginBottom: '20px', animation: 'fadeIn 0.3s ease' }}>
                  <label style={{ display: 'block', color: '#475569', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Telebirr Mobile Number *</label>
                  <input type="tel" placeholder="09XX XXX XXX" style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              )}
              
              {paymentInfo.method === 'cbebirr' && (
                <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px', marginBottom: '20px', animation: 'fadeIn 0.3s ease' }}>
                  <label style={{ display: 'block', color: '#475569', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>CBE Account Number *</label>
                  <input type="tel" placeholder="1000XXXXXXXXX" style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(1)} style={{ background: '#f1f5f9', color: '#475569', padding: '15px 30px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>Back</button>
                <button onClick={handleNext} style={{ background: '#0f172a', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                  Review Order
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
                {customerInfo.specialRequests && <p style={{ margin: '10px 0 0 0', color: '#475569', fontStyle: 'italic' }}>Note: {customerInfo.specialRequests}</p>}
                
                {type === 'order' && (
                  <>
                    <h3 style={{ margin: '15px 0 10px 0', fontSize: '1.1rem', color: '#0f172a' }}>Payment Method</h3>
                    <p style={{ margin: 0, color: '#475569' }}>
                      {paymentInfo.method === 'card' ? '💳 Credit / Debit Card' : 
                       paymentInfo.method === 'telebirr' ? '📱 Telebirr' : 
                       paymentInfo.method === 'cbebirr' ? '🏦 CBE Birr' : '💵 Cash on Delivery'}
                    </p>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(2)} style={{ background: '#f1f5f9', color: '#475569', padding: '15px 30px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', opacity: loading ? 0.5 : 1 }} disabled={loading}>Back</button>
                <button onClick={handleConfirm} disabled={loading} style={{ background: '#2563eb', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Processing...' : (type === 'order' ? 'Place Order' : 'Confirm Reservation')}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ background: 'white', padding: '3rem 2rem', borderRadius: '15px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem auto' }}>
                ✓
              </div>
              <h2 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '2rem' }}>
                {type === 'order' ? 'Order Confirmed!' : 'Table Reserved!'}
              </h2>
              <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>
                {type === 'order' 
                  ? 'Your food is being prepared and will be on its way soon.' 
                  : `We're looking forward to hosting you at ${business.name}.`}
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

              {type === 'reservation' ? (
                <div>
                  <h4 style={{ margin: '0 0 15px 0', color: '#0f172a' }}>Reservation Details</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#475569' }}>
                    <span>Table</span>
                    <span style={{ fontWeight: 'bold' }}>{table?.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#475569' }}>
                    <span>Date</span>
                    <span style={{ fontWeight: 'bold' }}>{date}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#475569' }}>
                    <span>Time</span>
                    <span style={{ fontWeight: 'bold' }}>{time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#475569' }}>
                    <span>Guests</span>
                    <span style={{ fontWeight: 'bold' }}>{guests} People</span>
                  </div>
                  <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
                    No payment required for reservation.
                  </div>
                </div>
              ) : (
                <div>
                  <h4 style={{ margin: '0 0 15px 0', color: '#0f172a' }}>Order Summary</h4>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#475569', fontSize: '0.95rem' }}>
                      <span>{item.quantity}x {item.name}</span>
                      <span>{(item.price * item.quantity).toLocaleString()} ETB</span>
                    </div>
                  ))}
                  
                  <div style={{ borderTop: '1px dashed #cbd5e1', margin: '15px 0' }}></div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#64748b', fontSize: '0.9rem' }}>
                    <span>Subtotal</span>
                    <span>{cartTotal.toLocaleString()} ETB</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#64748b', fontSize: '0.9rem' }}>
                    <span>Service Fee</span>
                    <span>50 ETB</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>Total</span>
                    <span style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '1.3rem' }}>{grandTotal.toLocaleString()} ETB</span>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RestaurantCheckoutFlow;
