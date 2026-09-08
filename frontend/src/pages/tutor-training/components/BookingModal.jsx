import React, { useState } from 'react';

function BookingModal({ tutor, onClose }) {
  const [step, setStep] = useState(1); // 1: Profile/Service, 2: Date/Time, 3: Summary/Payment, 4: Confirmation
  const [mode, setMode] = useState(tutor.modes[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(1);

  const calculatePrice = (hourlyPrice, durationHours) => {
    return hourlyPrice * durationHours;
  };

  const tutorFee = calculatePrice(tutor.price, duration);
  const serviceFee = tutorFee * 0.05; // 5% service fee
  const total = tutorFee + serviceFee;

  const handleNextStep = () => setStep(step + 1);
  const handleBackStep = () => setStep(step - 1);

  const handleBook = () => {
    // Mocking booking API call
    setTimeout(() => {
      setStep(4);
    }, 1500);
  };

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal">
        <button className="close-btn" onClick={onClose}>×</button>

        {step === 1 && (
          <div className="modal-step profile-step">
            <div className="profile-header">
              <img src={tutor.image} alt={tutor.name} className="profile-img" />
              <div>
                <h2>{tutor.name}</h2>
                <p>{tutor.subject}</p>
                <div className="profile-rating">
                  ⭐ {tutor.rating} ({tutor.students} students)
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>About</h3>
              <p>{tutor.bio}</p>
            </div>

            <div className="profile-section">
              <h3>Learning Mode</h3>
              <div className="mode-selector">
                {tutor.modes.includes('online') && (
                  <label className={`mode-option ${mode === 'online' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="mode" 
                      value="online" 
                      checked={mode === 'online'} 
                      onChange={() => setMode('online')} 
                    />
                    🟢 Online
                  </label>
                )}
                {tutor.modes.includes('physical') && (
                  <label className={`mode-option ${mode === 'physical' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="mode" 
                      value="physical" 
                      checked={mode === 'physical'} 
                      onChange={() => setMode('physical')} 
                    />
                    📍 Physical
                  </label>
                )}
              </div>
              {mode === 'physical' && (
                <div className="location-info">
                  <p><strong>Location:</strong> {tutor.location}</p>
                  <small>Full address provided after booking.</small>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <div className="price-info">
                <strong>{tutor.price} {tutor.currency}</strong> / hour
              </div>
              <button className="primary-btn" onClick={handleNextStep}>Select Date & Time</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="modal-step datetime-step">
            <h2>Select Date & Time</h2>
            
            <div className="form-group">
              <label>Available Days:</label>
              <div className="availability-badges">
                {tutor.availability.map(day => <span key={day} className="badge">{day}</span>)}
              </div>
            </div>

            <div className="form-group">
              <label>Select Date:</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Select Time:</label>
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">-- Choose Time --</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>

            <div className="form-group">
              <label>Duration (Hours):</label>
              <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                <option value={1}>1 Hour</option>
                <option value={1.5}>1.5 Hours</option>
                <option value={2}>2 Hours</option>
                <option value={3}>3 Hours</option>
              </select>
            </div>

            <div className="modal-footer split">
              <button className="secondary-btn" onClick={handleBackStep}>Back</button>
              <button 
                className="primary-btn" 
                onClick={handleNextStep}
                disabled={!date || !time}
              >
                Review Booking
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="modal-step summary-step">
            <h2>Booking Summary</h2>
            
            <div className="summary-card">
              <div className="summary-row">
                <span>Tutor</span>
                <strong>{tutor.name}</strong>
              </div>
              <div className="summary-row">
                <span>Subject</span>
                <strong>{tutor.subject}</strong>
              </div>
              <div className="summary-row">
                <span>Mode</span>
                <strong>{mode === 'online' ? 'Online' : 'Physical'}</strong>
              </div>
              <div className="summary-row">
                <span>Date & Time</span>
                <strong>{date} at {time}</strong>
              </div>
              <div className="summary-row">
                <span>Duration</span>
                <strong>{duration} hours</strong>
              </div>
              
              <hr />
              
              <div className="summary-row">
                <span>Tutor fee</span>
                <span>{tutorFee} {tutor.currency}</span>
              </div>
              <div className="summary-row">
                <span>Service fee</span>
                <span>{serviceFee} {tutor.currency}</span>
              </div>
              
              <hr />
              
              <div className="summary-row total-row">
                <span>TOTAL</span>
                <strong>{total} {tutor.currency}</strong>
              </div>
            </div>

            <div className="payment-options">
              <h3>Payment Method</h3>
              <label className="payment-option"><input type="radio" name="payment" defaultChecked /> ServiceHub Wallet</label>
              <label className="payment-option"><input type="radio" name="payment" /> Card</label>
              <label className="payment-option"><input type="radio" name="payment" /> Mobile Money</label>
            </div>

            <div className="modal-footer split">
              <button className="secondary-btn" onClick={handleBackStep}>Back</button>
              <button className="primary-btn checkout-btn" onClick={handleBook}>Pay {total} {tutor.currency}</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="modal-step confirmation-step">
            <div className="success-icon">✓</div>
            <h2>SESSION BOOKED</h2>
            <p className="booking-ref">Booking #SH-TUT-{Math.floor(Math.random() * 100000)}</p>
            
            <div className="confirmation-details">
              <p><strong>{tutor.name}</strong> - {tutor.subject}</p>
              <p>{date} at {time}</p>
              <p>{mode === 'online' ? 'Online Session' : 'Physical Session'}</p>
              <p>Total: {total} {tutor.currency}</p>
            </div>

            <div className="modal-footer vertical">
              <button className="primary-btn" onClick={onClose}>Add to Calendar</button>
              <button className="secondary-btn" onClick={onClose}>View My Learning</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
