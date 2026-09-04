import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const CleaningCheckoutFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { provider, serviceDetails } = location.state || {};
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    specialInstructions: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'telebirr', // 'card', 'telebirr', 'cbebirr', 'cash'
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  if (!provider || !serviceDetails) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Inter', sans-serif" }}>
        <h2>Invalid Checkout Session</h2>
        <Link to="/shop/cleaning" style={{ color: '#2563eb' }}>Return to Search</Link>
      </div>
    );
  }

  const handleNext = () => {
    if (step === 1) {
      if (!customerInfo.firstName || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
        return alert("Please fill out all required fields including your address.");
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
    // Simulating network request for payment and booking creation
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    
    // In a real app, this would be an axios.post to /api/bookings
    setLoading(false);
    setStep(4);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", padding: '2rem 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Left Side: Forms */}
        <div style={{ flex: '1 1 600px' }}>
          
          <h1 style={{ fontSize: '2rem', margin: '0 0 2rem 0', color: '#0f172a' }}>
            Complete Your Cleaning Booking
          </h1>
          
          <div style={{ display: 'flex', marginBottom: '2rem', gap: '10px' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ 
                flex: 1, height: '6px', borderRadius: '3px',
                background: step >= s ? '#3b82f6' : '#e2e8f0',
                transition: 'background 0.3s'
              }}></div>
            ))}
          </div>

          {step === 1 && (
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ margin: '0 0 1.5rem 0', color: '#0f172a', fontSize: '1.5rem' }}>Personal & Location Details</h2>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <input type="text" placeholder="First Name *" value={customerInfo.firstName} onChange={e => setCustomerInfo({...customerInfo, firstName: e.target.value})} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
                <input type="text" placeholder="Last Name" value={customerInfo.lastName} onChange={e => setCustomerInfo({...customerInfo, lastName: e.target.value})} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
              </div>
              <input type="email" placeholder="Email Address *" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '15px', fontSize: '1rem', outline: 'none' }} />
              <input type="tel" placeholder="Phone Number *" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '15px', fontSize: '1rem', outline: 'none' }} />
              
              <label style={{ display: 'block', color: '#475569', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 'bold' }}>Service Address *</label>
              <textarea placeholder="Full address including apartment number, street, city..." value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} rows="2" style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '15px', fontSize: '1rem', outline: 'none' }}></textarea>

              <label style={{ display: 'block', color: '#475569', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 'bold' }}>Special Instructions (Optional)</label>
              <textarea placeholder="Any specific areas to focus on or gate codes..." value={customerInfo.specialInstructions} onChange={e => setCustomerInfo({...customerInfo, specialInstructions: e.target.value})} rows="3" style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '20px', fontSize: '1rem', outline: 'none' }}></textarea>
              
              <button onClick={handleNext} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'block', marginLeft: 'auto', boxShadow: '0 10px 20px -10px rgba(59, 130, 246, 0.5)' }}>
                Next: Payment Details
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ margin: '0 0 1.5rem 0', color: '#0f172a', fontSize: '1.5rem' }}>Payment Method</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                {/* Option 1: Card */}
                <div 
                  onClick={() => setPaymentInfo({...paymentInfo, method: 'card'})}
                  style={{ border: paymentInfo.method === 'card' ? '2px solid #3b82f6' : '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', background: paymentInfo.method === 'card' ? '#eff6ff' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 'bold', color: paymentInfo.method === 'card' ? '#1e3a8a' : '#475569', cursor: 'pointer', fontSize: '1.1rem' }}>
                    <input type="radio" checked={paymentInfo.method === 'card'} onChange={() => {}} style={{ accentColor: '#3b82f6', transform: 'scale(1.2)' }} />
                    💳 Credit / Debit Card
                  </label>
                </div>

                {/* Option 2: Telebirr */}
                <div 
                  onClick={() => setPaymentInfo({...paymentInfo, method: 'telebirr'})}
                  style={{ border: paymentInfo.method === 'telebirr' ? '2px solid #3b82f6' : '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', background: paymentInfo.method === 'telebirr' ? '#eff6ff' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 'bold', color: paymentInfo.method === 'telebirr' ? '#1e3a8a' : '#475569', cursor: 'pointer', fontSize: '1.1rem' }}>
                    <input type="radio" checked={paymentInfo.method === 'telebirr'} onChange={() => {}} style={{ accentColor: '#3b82f6', transform: 'scale(1.2)' }} />
                    📱 Telebirr
                  </label>
                </div>

                {/* Option 3: CBE Birr */}
                <div 
                  onClick={() => setPaymentInfo({...paymentInfo, method: 'cbebirr'})}
                  style={{ border: paymentInfo.method === 'cbebirr' ? '2px solid #3b82f6' : '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', background: paymentInfo.method === 'cbebirr' ? '#eff6ff' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 'bold', color: paymentInfo.method === 'cbebirr' ? '#1e3a8a' : '#475569', cursor: 'pointer', fontSize: '1.1rem' }}>
                    <input type="radio" checked={paymentInfo.method === 'cbebirr'} onChange={() => {}} style={{ accentColor: '#3b82f6', transform: 'scale(1.2)' }} />
                    🏦 CBE Birr
                  </label>
                </div>

                {/* Option 4: Cash */}
                <div 
                  onClick={() => setPaymentInfo({...paymentInfo, method: 'cash'})}
                  style={{ border: paymentInfo.method === 'cash' ? '2px solid #3b82f6' : '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', background: paymentInfo.method === 'cash' ? '#eff6ff' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 'bold', color: paymentInfo.method === 'cash' ? '#1e3a8a' : '#475569', cursor: 'pointer', fontSize: '1.1rem' }}>
                    <input type="radio" checked={paymentInfo.method === 'cash'} onChange={() => {}} style={{ accentColor: '#3b82f6', transform: 'scale(1.2)' }} />
                    💵 Pay After Service (Cash)
                  </label>
                </div>
              </div>

              {/* Card Form conditional rendering */}
              {paymentInfo.method === 'card' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <input type="text" placeholder="Card Number *" value={paymentInfo.cardNumber} onChange={e => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})} style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '15px', fontSize: '1rem', outline: 'none' }} />
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <input type="text" placeholder="MM/YY" value={paymentInfo.expiry} onChange={e => setPaymentInfo({...paymentInfo, expiry: e.target.value})} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
                    <input type="text" placeholder="CVV" value={paymentInfo.cvv} onChange={e => setPaymentInfo({...paymentInfo, cvv: e.target.value})} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
                  </div>
                </div>
              )}
              
              {paymentInfo.method === 'telebirr' && (
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '10px', marginBottom: '20px', animation: 'fadeIn 0.3s ease' }}>
                  <label style={{ display: 'block', color: '#475569', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 'bold' }}>Telebirr Mobile Number *</label>
                  <input type="tel" placeholder="09XX XXX XXX" style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
                  <p style={{ margin: '10px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>You will receive a USSD prompt on your phone to confirm the payment.</p>
                </div>
              )}
              
              {paymentInfo.method === 'cbebirr' && (
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '10px', marginBottom: '20px', animation: 'fadeIn 0.3s ease' }}>
                  <label style={{ display: 'block', color: '#475569', marginBottom: '8px', fontSize: '0.95rem', fontWeight: 'bold' }}>CBE Account Number *</label>
                  <input type="tel" placeholder="1000XXXXXXXXX" style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
                  <p style={{ margin: '10px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Enter your CBE account number. The payment will be processed securely.</p>
                </div>
              )}
              
              {paymentInfo.method === 'cash' && (
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '10px', marginBottom: '20px', color: '#475569', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
                  No payment required now. You will pay the cleaner directly after the service is completed.
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(1)} style={{ background: '#f1f5f9', color: '#475569', padding: '15px 30px', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>Back</button>
                <button onClick={handleNext} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px -10px rgba(59, 130, 246, 0.5)' }}>
                  Review Booking
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', animation: 'fadeIn 0.3s ease' }}>
              <h2 style={{ margin: '0 0 1.5rem 0', color: '#0f172a', fontSize: '1.5rem' }}>Review & Confirm</h2>
              
              <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#0f172a' }}>Contact Info</h3>
                <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem' }}>{customerInfo.firstName} {customerInfo.lastName}</p>
                <p style={{ margin: '5px 0 0 0', color: '#475569', fontSize: '1.05rem' }}>{customerInfo.email} • {customerInfo.phone}</p>
                
                <h3 style={{ margin: '20px 0 10px 0', fontSize: '1.2rem', color: '#0f172a' }}>Service Location</h3>
                <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem' }}>{customerInfo.address}</p>
                {customerInfo.specialInstructions && (
                  <p style={{ margin: '10px 0 0 0', color: '#64748b', fontStyle: 'italic' }}>Notes: {customerInfo.specialInstructions}</p>
                )}

                <h3 style={{ margin: '20px 0 10px 0', fontSize: '1.2rem', color: '#0f172a' }}>Payment Method</h3>
                <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem' }}>
                  {paymentInfo.method === 'card' ? '💳 Credit / Debit Card' : 
                   paymentInfo.method === 'telebirr' ? '📱 Telebirr' : 
                   paymentInfo.method === 'cbebirr' ? '🏦 CBE Birr' : 
                   '💵 Pay After Service (Cash)'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(2)} style={{ background: '#f1f5f9', color: '#475569', padding: '15px 30px', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', opacity: loading ? 0.5 : 1 }} disabled={loading}>Back</button>
                <button onClick={handleConfirm} disabled={loading} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px -10px rgba(16, 185, 129, 0.5)' }}>
                  {loading ? (
                    <>
                      <span style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                      Processing...
                    </>
                  ) : 'Confirm & Pay'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ background: 'white', padding: '4rem 2rem', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', animation: 'fadeIn 0.5s ease' }}>
              <div style={{ width: '100px', height: '100px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 2rem auto', boxShadow: '0 0 0 10px rgba(22, 163, 74, 0.1)' }}>
                ✓
              </div>
              <h2 style={{ margin: '0 0 15px 0', color: '#0f172a', fontSize: '2.5rem', fontWeight: 800 }}>Booking Confirmed!</h2>
              <p style={{ color: '#64748b', fontSize: '1.2rem', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem auto' }}>
                Your {serviceDetails.serviceType.toLowerCase()} is confirmed for {serviceDetails.date} at {serviceDetails.time} with {provider.name}.
              </p>
              <Link to="/my-bookings" style={{ display: 'inline-block', background: '#0f172a', color: 'white', padding: '14px 30px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'} onMouseOut={(e) => e.currentTarget.style.background = '#0f172a'}>
                View My Bookings
              </Link>
            </div>
          )}

        </div>

        {/* Right Side: Summary Card */}
        {step < 4 && (
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', position: 'sticky', top: '2rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', animation: 'fadeIn 0.3s ease' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: `url(${provider.image}) center/cover` }}></div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#0f172a', marginBottom: '5px' }}>{provider.name}</h3>
                  <div style={{ color: '#854d0e', fontSize: '0.9rem', background: '#fef08a', display: 'inline-block', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>⭐ {provider.rating}</div>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 15px 0', color: '#0f172a', fontSize: '1.2rem' }}>Booking Summary</h4>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#475569', fontSize: '1.05rem' }}>
                  <span>Service</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{serviceDetails.serviceType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#475569', fontSize: '1.05rem' }}>
                  <span>Property</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{serviceDetails.propertyType} ({serviceDetails.size} m²)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#475569', fontSize: '1.05rem' }}>
                  <span>Date</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{serviceDetails.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#475569', fontSize: '1.05rem' }}>
                  <span>Time</span>
                  <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{serviceDetails.time}</span>
                </div>
                
                <div style={{ borderTop: '2px dashed #e2e8f0', margin: '20px 0' }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.3rem' }}>Total</span>
                  <span style={{ fontWeight: 800, color: '#2563eb', fontSize: '1.8rem' }}>{provider.price}</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default CleaningCheckoutFlow;
