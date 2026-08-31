import React, { useState, useEffect } from 'react';
import { useLocation, Link, Navigate, useNavigate } from 'react-router-dom';

const HotelBookingFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Form State
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    requests: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('telebirr');

  if (!state) {
    return <Navigate to="/category/Hotel" />;
  }

  const { hotelId, hotelName, room, checkIn, checkOut, guests } = state;

  // Calculate nights
  const getDays = () => {
    if (!checkIn || !checkOut) return 1;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 ? diffDays : 1;
  };
  
  const nights = getDays();
  const total = room.price * nights;

  const handleInputChange = (e) => {
    setGuestDetails({ ...guestDetails, [e.target.name]: e.target.value });
  };

  const handleConfirm = () => {
    setLoading(true);
    // Simulate API call to book hotel
    setTimeout(() => {
      setBookingRef(`HTL-${Math.floor(Math.random() * 100000)}`);
      setStep(4);
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '3rem 24px', fontFamily: "'Inter', sans-serif" }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Progress Bar */}
        {step < 4 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', top: '50%', left: '0', width: step === 1 ? '0%' : step === 2 ? '50%' : '100%', height: '2px', background: '#2563eb', zIndex: 0, transition: '0.3s' }}></div>
            
            <div style={{ background: step >= 1 ? '#2563eb' : 'white', color: step >= 1 ? 'white' : '#64748b', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', zIndex: 1, border: '2px solid #2563eb' }}>1</div>
            <div style={{ background: step >= 2 ? '#2563eb' : 'white', color: step >= 2 ? 'white' : '#64748b', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', zIndex: 1, border: step >= 2 ? '2px solid #2563eb' : '2px solid #e2e8f0' }}>2</div>
            <div style={{ background: step >= 3 ? '#2563eb' : 'white', color: step >= 3 ? 'white' : '#64748b', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', zIndex: 1, border: step >= 3 ? '2px solid #2563eb' : '2px solid #e2e8f0' }}>3</div>
          </div>
        )}

        {/* Step 1: Guest Details */}
        {step === 1 && (
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 500px' }}>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                <h2 style={{ margin: '0 0 1.5rem 0', color: '#0f172a' }}>Guest Details</h2>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>First Name</label>
                    <input type="text" name="firstName" value={guestDetails.firstName} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Last Name</label>
                    <input type="text" name="lastName" value={guestDetails.lastName} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Email Address</label>
                  <input type="email" name="email" value={guestDetails.email} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Phone Number</label>
                  <input type="tel" name="phone" value={guestDetails.phone} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Special Requests (Optional)</label>
                  <textarea name="requests" value={guestDetails.requests} onChange={handleInputChange} rows="3" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} placeholder="Late check-in, extra bed..."></textarea>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone}
                  style={{ width: '100%', padding: '15px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', opacity: (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone) ? 0.5 : 1 }}
                >
                  Continue to Payment
                </button>
              </div>
            </div>

            {/* Sidebar Summary */}
            <SummarySidebar hotelName={hotelName} room={room} checkIn={checkIn} checkOut={checkOut} guests={guests} nights={nights} total={total} />
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 500px' }}>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                  <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>←</button>
                  <h2 style={{ margin: 0, color: '#0f172a' }}>Payment Method</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: paymentMethod === 'telebirr' ? '2px solid #2563eb' : '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', background: paymentMethod === 'telebirr' ? '#eff6ff' : 'white' }}>
                    <input type="radio" name="payment" value="telebirr" checked={paymentMethod === 'telebirr'} onChange={(e) => setPaymentMethod(e.target.value)} />
                    <span style={{ fontWeight: 'bold', color: '#0f172a' }}>Telebirr</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: paymentMethod === 'cbe' ? '2px solid #2563eb' : '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', background: paymentMethod === 'cbe' ? '#eff6ff' : 'white' }}>
                    <input type="radio" name="payment" value="cbe" checked={paymentMethod === 'cbe'} onChange={(e) => setPaymentMethod(e.target.value)} />
                    <span style={{ fontWeight: 'bold', color: '#0f172a' }}>CBE Birr</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: paymentMethod === 'card' ? '2px solid #2563eb' : '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', background: paymentMethod === 'card' ? '#eff6ff' : 'white' }}>
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                    <span style={{ fontWeight: 'bold', color: '#0f172a' }}>Credit/Debit Card</span>
                  </label>
                </div>

                <button 
                  onClick={() => setStep(3)}
                  style={{ width: '100%', padding: '15px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Review Booking
                </button>
              </div>
            </div>

            <SummarySidebar hotelName={hotelName} room={room} checkIn={checkIn} checkOut={checkOut} guests={guests} nights={nights} total={total} />
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 500px' }}>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                  <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>←</button>
                  <h2 style={{ margin: 0, color: '#0f172a' }}>Review & Confirm</h2>
                </div>

                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#0f172a' }}>Guest Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: '#475569' }}>
                    <div><strong>Name:</strong> {guestDetails.firstName} {guestDetails.lastName}</div>
                    <div><strong>Email:</strong> {guestDetails.email}</div>
                    <div><strong>Phone:</strong> {guestDetails.phone}</div>
                    <div><strong>Payment:</strong> <span style={{ textTransform: 'capitalize' }}>{paymentMethod}</span></div>
                  </div>
                </div>

                <button 
                  onClick={handleConfirm}
                  disabled={loading}
                  style={{ width: '100%', padding: '15px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'Processing...' : `Pay ${total.toLocaleString()} ETB & Book`}
                </button>
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.8rem', color: '#64748b' }}>
                  By clicking this, you agree to the hotel's cancellation policy.
                </div>
              </div>
            </div>

            <SummarySidebar hotelName={hotelName} room={room} checkIn={checkIn} checkOut={checkOut} guests={guests} nights={nights} total={total} />
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div style={{ background: 'white', padding: '3rem', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 1.5rem' }}>
              ✓
            </div>
            <h2 style={{ fontSize: '2rem', color: '#0f172a', margin: '0 0 0.5rem 0' }}>Booking Confirmed!</h2>
            <p style={{ color: '#475569', marginBottom: '2rem' }}>We've sent a confirmation email to {guestDetails.email}</p>

            <div style={{ background: '#f8fafc', borderRadius: '15px', padding: '2rem', textAlign: 'left', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px dashed #cbd5e1' }}>
                <div style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Booking Reference</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{bookingRef}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: '#64748b', fontWeight: 'bold' }}>Hotel</span>
                <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{hotelName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: '#64748b', fontWeight: 'bold' }}>Room</span>
                <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{room.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: '#64748b', fontWeight: 'bold' }}>Check-in</span>
                <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{checkIn}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: '#64748b', fontWeight: 'bold' }}>Check-out</span>
                <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{checkOut}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: 'bold' }}>Guests</span>
                <span style={{ color: '#0f172a', fontWeight: 'bold' }}>{guests} Guests</span>
              </div>
            </div>

            <Link to="/">
              <button style={{ width: '100%', padding: '15px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                Back to Home
              </button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

// Extracted Sidebar Component for reuse across steps
const SummarySidebar = ({ hotelName, room, checkIn, checkOut, guests, nights, total }) => (
  <div style={{ flex: '1 1 300px' }}>
    <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #e2e8f0', position: 'sticky', top: '2rem' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', color: '#0f172a' }}>Booking Summary</h3>
      
      <div style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
        <img src={room.image} alt="Room" style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }} />
        <div>
          <h4 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>{hotelName}</h4>
          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{room.name}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ color: '#64748b' }}>Check-in</span>
        <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{checkIn}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ color: '#64748b' }}>Check-out</span>
        <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{checkOut}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
        <span style={{ color: '#64748b' }}>Length of Stay</span>
        <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{nights} Night(s)</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ color: '#64748b' }}>{room.price} ETB x {nights} nights</span>
        <span style={{ color: '#0f172a' }}>{total.toLocaleString()} ETB</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ color: '#64748b' }}>Taxes & Fees (15%)</span>
        <span style={{ color: '#0f172a' }}>{(total * 0.15).toLocaleString()} ETB</span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px dashed #e2e8f0' }}>
        <span style={{ color: '#0f172a', fontWeight: 'bold', fontSize: '1.2rem' }}>Total</span>
        <span style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '1.2rem' }}>{(total * 1.15).toLocaleString()} ETB</span>
      </div>
    </div>
  </div>
);

export default HotelBookingFlow;
