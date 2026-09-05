import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMapPin, FiStar, FiClock, FiCheck, FiUsers, FiActivity } from 'react-icons/fi';

const GymDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('membership');

  const [gym, setGym] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/businesses/${id}`);
        setGym(res.data);
        
        const mems = [];
        const cls = [];
        const trn = [];
        
        if (res.data.services) {
          res.data.services.forEach(s => {
            let category = 'Unknown';
            let actualDesc = s.description || '';
            
            if (actualDesc.includes('|')) {
              const parts = actualDesc.split('|');
              category = parts[0];
              actualDesc = parts[1];
            }

            const name = s.name.toLowerCase();
            const mapped = {
              id: s.id,
              name: s.name,
              price: s.price,
              duration: actualDesc || 'Standard',
              description: actualDesc || ''
            };

            // Categorize based on explicit category OR fallback to keywords
            if (category === 'Membership' || name.includes('plan') || name.includes('membership') || name.includes('access')) {
              mems.push({ ...mapped, features: ['Access to gym floor', 'Locker room access'] });
            } else if (category === 'Trainer' || name.includes('pt') || name.includes('trainer') || name.includes('session') || name.includes('coach')) {
              trn.push({ ...mapped, specialty: mapped.duration, rating: 4.8 });
            } else {
              cls.push({ ...mapped, time: mapped.duration, trainer: 'Staff', level: 'All Levels' });
            }
          });
        }
        
        setMemberships(mems);
        setClasses(cls);
        setTrainers(trn);
      } catch (err) {
        console.error('Failed to fetch gym:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGym();
  }, [id]);

  const handleChoosePlan = (plan) => {
    navigate('/checkout/gym', { state: { plan, gymId: id, type: 'membership' } });
  };

  const handleBookClass = (cls) => {
    navigate('/checkout/gym', { state: { 
      plan: { 
        name: cls.name, 
        duration: '1 Class', 
        price: cls.price, 
        features: [`Time: ${cls.time}`, `Level: ${cls.level}`] 
      }, 
      gymId: id, 
      type: 'class' 
    }});
  };

  const handleBookTrainer = (trainer) => {
    navigate('/checkout/gym', { state: { 
      plan: { 
        name: trainer.name, 
        duration: '1 Session', 
        price: trainer.price, 
        features: [`Specialty: ${trainer.specialty}`] 
      }, 
      gymId: id, 
      type: 'trainer' 
    }});
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Gym...</div>;
  if (!gym) return <div style={{ padding: '40px', textAlign: 'center' }}>Gym not found</div>;

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Hero Section */}
      <div className="glass-panel" style={{ padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', fontSize: '15rem', opacity: 0.03, pointerEvents: 'none' }}>
          🏋️
        </div>
        
        <h1 className="gradient-text" style={{ fontSize: '3rem', margin: '0 0 16px 0' }}>{gym.name}</h1>
        
        <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)', marginBottom: '24px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiMapPin /> {gym.address || 'Addis Ababa'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)' }}><FiStar /> 4.8 (124 Reviews)</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiClock /> Open 5:00 AM - 11:00 PM</span>
        </div>
        
        <p style={{ maxWidth: '800px', lineHeight: '1.6' }}>
          {gym.description || 'Welcome to our premier fitness destination. We offer state-of-the-art equipment, dynamic group classes, and expert personal trainers to help you reach your fitness goals.'}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
        {['membership', 'classes', 'trainers', 'schedule', 'reviews'].map(tab => (
          <button 
            key={tab}
            className={`btn-secondary ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{ 
              textTransform: 'capitalize', 
              background: activeTab === tab ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
              color: activeTab === tab ? 'white' : 'var(--text-secondary)',
              border: 'none',
              minWidth: 'max-content'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        
        {/* MEMBERSHIP TAB */}
        {activeTab === 'membership' && (
          <div>
            <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiCheck /> Membership Plans
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              {memberships.length > 0 ? memberships.map((plan) => (
                <div key={plan.id} className="glass-panel hover-scale" style={{ 
                  padding: '32px 24px', 
                  display: 'flex', flexDirection: 'column',
                  border: plan.name.toLowerCase().includes('premium') ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)',
                  position: 'relative'
                }}>
                  {plan.name.toLowerCase().includes('premium') && (
                    <div style={{ position: 'absolute', top: 0, right: '50%', transform: 'translate(50%, -50%)', background: 'var(--accent-gradient)', padding: '4px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      MOST POPULAR
                    </div>
                  )}
                  
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{plan.name}</h3>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{plan.duration}</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '24px', color: 'var(--accent-secondary)' }}>
                    {plan.price.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>ETB</span>
                  </div>
                  
                  <div style={{ flex: 1, marginBottom: '24px' }}>
                    {plan.features.map((feature, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <FiCheck color="var(--success)" /> {feature}
                      </div>
                    ))}
                  </div>
                  
                  <button className={plan.name.toLowerCase().includes('premium') ? "btn-primary" : "btn-secondary"} style={{ width: '100%', padding: '14px' }} onClick={() => handleChoosePlan(plan)}>
                    CHOOSE PLAN
                  </button>
                </div>
              )) : <div style={{ color: 'var(--text-secondary)' }}>No memberships currently available.</div>}
            </div>
          </div>
        )}

        {/* CLASSES TAB */}
        {activeTab === 'classes' && (
          <div>
            <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiActivity /> Fitness Classes
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {classes.length > 0 ? classes.map(cls => (
                <div key={cls.id} className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0' }}>{cls.name}</h3>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <span><FiClock style={{ verticalAlign: 'middle' }}/> {cls.time}</span>
                      <span><FiUsers style={{ verticalAlign: 'middle' }}/> Trainer: {cls.trainer}</span>
                      <span style={{ color: 'var(--accent-secondary)' }}>Level: {cls.level}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{cls.price} ETB</span>
                    <button className="btn-primary" onClick={() => handleBookClass(cls)}>Book Class</button>
                  </div>
                </div>
              )) : <div style={{ color: 'var(--text-secondary)' }}>No classes currently available.</div>}
            </div>
          </div>
        )}

        {/* TRAINERS TAB */}
        {activeTab === 'trainers' && (
          <div>
            <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiUsers /> Personal Trainers
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              {trainers.length > 0 ? trainers.map(trainer => (
                <div key={trainer.id} className="glass-panel hover-scale" style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-gradient)', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiUsers size={32} />
                  </div>
                  <h3 style={{ margin: '0 0 8px 0' }}>{trainer.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: '0 0 16px 0', fontSize: '0.9rem' }}>{trainer.specialty}</p>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', color: 'var(--warning)', marginBottom: '16px' }}>
                    <FiStar /><FiStar /><FiStar /><FiStar /><FiStar /> 
                  </div>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent-secondary)', marginBottom: '16px' }}>
                    {trainer.price} ETB / Session
                  </div>
                  <button className="btn-secondary" style={{ width: '100%' }} onClick={() => handleBookTrainer(trainer)}>Book Session</button>
                </div>
              )) : <div style={{ color: 'var(--text-secondary)' }}>No trainers currently available.</div>}
            </div>
          </div>
        )}

        {/* Placeholder for Schedule and Reviews */}
        {(activeTab === 'schedule' || activeTab === 'reviews') && (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <h3 style={{ marginBottom: '16px' }}>{activeTab === 'schedule' ? 'Weekly Schedule' : 'Customer Reviews'}</h3>
            <p>This section is currently being updated. Please check back later.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default GymDetail;
