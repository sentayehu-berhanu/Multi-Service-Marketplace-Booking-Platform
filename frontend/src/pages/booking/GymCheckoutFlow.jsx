import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiCheckCircle, FiCreditCard, FiCalendar, FiUser } from 'react-icons/fi';

const GymCheckoutFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Extract plan info passed from GymDetail via React Router state
  const { plan, gymId, type } = location.state || {};

  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'telebirr'
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Fetch the Gym business from backend
      const bizRes = await axios.get('http://localhost:5000/api/businesses?category=gym');
      const gym = bizRes.data.find(b => b.name === 'Power Gym') || bizRes.data[0];
      
      if (!gym || !gym.services || gym.services.length === 0) {
        throw new Error('Gym or services not found in database.');
      }

      // Find the corresponding service in the database
      // If we can't find an exact match, fallback to the first service so it still works
      let service = gym.services.find(s => s.name === plan.name) || gym.services[0];

      const startTime = new Date(formData.startDate).toISOString();
      
      await axios.post('http://localhost:5000/api/bookings', {
        business_id: gym.id,
        service_id: service.id,
        start_time: startTime
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStep(3); // Success step
    } catch (err) {
      console.error('Error processing membership:', err);
      alert('Failed to process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>No plan selected. Please go back and select a plan.</div>;
  }

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Step Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}></div>
        {[
          { num: 1, label: 'Plan Details' },
          { num: 2, label: 'Payment' },
          { num: 3, label: 'Confirmation' }
        ].map(s => (
          <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '8px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: step >= s.num ? 'var(--accent-gradient)' : '#1A1A2E',
              border: step >= s.num ? 'none' : '2px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', color: step >= s.num ? 'white' : 'var(--text-secondary)'
            }}>
              {step > s.num ? <FiCheckCircle size={20} /> : s.num}
            </div>
            <span style={{ fontSize: '0.85rem', color: step >= s.num ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '40px' }}>
        
        {/* STEP 1: Details */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '24px' }}>Review Your Membership</h2>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--accent-primary)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', margin: '0 0 4px 0' }}>{plan.name} Plan</h3>
                  <span style={{ color: 'var(--text-secondary)' }}>{plan.duration}</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>
                  {plan.price.toLocaleString()} ETB
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                {plan.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label><FiCalendar style={{ marginRight: '8px' }}/> Start Date</label>
              <input 
                type="date" 
                name="startDate"
                className="input-field" 
                value={formData.startDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <button className="btn-primary" style={{ width: '100%', padding: '16px' }} onClick={() => setStep(2)}>
              Proceed to Payment
            </button>
          </div>
        )}

        {/* STEP 2: Payment */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '24px' }}>Payment Method</h2>
            
            <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
              {['telebirr', 'cbebirr', 'chapa'].map(method => (
                <label 
                  key={method}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', 
                    background: formData.paymentMethod === method ? 'rgba(107, 70, 193, 0.1)' : 'rgba(255,255,255,0.03)',
                    border: formData.paymentMethod === method ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value={method} 
                    checked={formData.paymentMethod === method}
                    onChange={handleInputChange}
                    style={{ accentColor: 'var(--accent-primary)', width: '20px', height: '20px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, textTransform: 'capitalize', fontSize: '1.1rem' }}>{method}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pay securely via {method}</span>
                  </div>
                  <FiCreditCard size={24} color="var(--text-secondary)" />
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              <span style={{ fontSize: '1.1rem' }}>Total to Pay:</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{plan.price.toLocaleString()} ETB</span>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '16px' }} onClick={() => setStep(1)} disabled={loading}>Back</button>
              <button className="btn-primary" style={{ flex: 2, padding: '16px' }} onClick={handleConfirm} disabled={loading}>
                {loading ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success */}
        {step === 3 && (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto',
              color: 'var(--success)'
            }}>
              <FiCheckCircle size={40} />
            </div>
            
            <h2 style={{ marginBottom: '16px', fontSize: '2rem' }}>Membership Confirmed!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Congratulations! Your {plan.name} Membership is now active. Your subscription will start on {formData.startDate}. Welcome to the gym!
            </p>

            <button className="btn-primary" style={{ padding: '16px 32px' }} onClick={() => navigate('/my-bookings')}>
              View My Memberships
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default GymCheckoutFlow;
