import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_HEALTHCARE = [
  {
    id: 'doc-1',
    name: 'Dr. Ahmed',
    type: 'Doctors',
    specialist: 'General Physician',
    rating: 4.9,
    experience: '12 years',
    location: 'Downtown Medical Center',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'clinic-1',
    name: 'City Care Clinic',
    type: 'Clinics',
    specialist: 'Multi-Specialty',
    rating: 4.7,
    experience: 'Est. 2010',
    location: 'Westside Avenue',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dentist-1',
    name: 'Bright Smiles Dental',
    type: 'Dentists',
    specialist: 'Orthodontics',
    rating: 4.8,
    experience: '8 years',
    location: 'Uptown Plaza',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lab-1',
    name: 'Precision Labs',
    type: 'Laboratories',
    specialist: 'Diagnostics',
    rating: 4.6,
    experience: 'N/A',
    location: 'North District',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'center-1',
    name: 'Hope Medical Center',
    type: 'Medical Centers',
    specialist: 'Comprehensive Care',
    rating: 4.9,
    experience: 'Est. 1995',
    location: 'Central Park Rd',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  }
];

const HealthcareSearch = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');

  const types = ['Doctors', 'Clinics', 'Dentists', 'Laboratories', 'Medical Centers'];

  const filtered = filter ? MOCK_HEALTHCARE.filter(h => h.type === filter) : MOCK_HEALTHCARE;

  return (
    <div style={{ background: '#f0fdfa', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header Banner */}
      <div style={{ background: '#115e59', padding: '4rem 24px', color: 'white', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>HEALTHCARE</h1>
        <p style={{ fontSize: '1.2rem', color: '#ccfbf1', maxWidth: '600px', margin: '0 auto' }}>
          Find trusted healthcare professionals and facilities near you.
        </p>
      </div>

      {/* Privacy Banner */}
      <div style={{ background: '#0f766e', color: 'white', padding: '12px 24px', textAlign: 'center', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
        <span>🔒</span>
        <span>Patient data is encrypted and strictly confidential according to local health data protection regulations.</span>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 24px', display: 'flex', gap: '2rem' }}>
        
        {/* Left Sidebar - Filters */}
        <div style={{ width: '280px', flexShrink: 0 }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', border: '1px solid #ccfbf1', position: 'sticky', top: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', color: '#115e59' }}>Find</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={() => setFilter('')}
                style={{ 
                  textAlign: 'left', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', border: 'none',
                  background: filter === '' ? '#e6fffa' : 'transparent',
                  color: filter === '' ? '#0d9488' : '#475569',
                  fontWeight: filter === '' ? 'bold' : 'normal'
                }}
              >
                All Healthcare
              </button>
              {types.map(type => (
                <button 
                  key={type}
                  onClick={() => setFilter(type)}
                  style={{ 
                    textAlign: 'left', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', border: 'none',
                    background: filter === type ? '#e6fffa' : 'transparent',
                    color: filter === type ? '#0d9488' : '#475569',
                    fontWeight: filter === type ? 'bold' : 'normal',
                    transition: '0.2s'
                  }}
                  onMouseOver={(e) => { if(filter !== type) e.target.style.background = '#f1f5f9'; }}
                  onMouseOut={(e) => { if(filter !== type) e.target.style.background = 'transparent'; }}
                >
                  👨‍⚕️ {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Results */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0, color: '#0f172a' }}>{filtered.length} Providers found</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filtered.map(item => (
              <div key={item.id} style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0', transition: '0.2s', ':hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' } }}>
                <div style={{ height: '200px', background: `url(${item.image}) center/cover no-repeat` }}></div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#0f172a' }}>{item.name}</h3>
                    <div style={{ background: '#f0fdfa', color: '#0d9488', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      ⭐ {item.rating}
                    </div>
                  </div>
                  
                  <div style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ color: '#0d9488', fontWeight: 'bold' }}>{item.specialist}</span>
                    <span>🕒 {item.experience}</span>
                    <span>📍 {item.location}</span>
                  </div>

                  <button 
                    onClick={() => navigate(item.type === 'Doctors' ? `/business/doctor/${item.id}` : `/shop/healthcare`)}
                    style={{ width: '100%', padding: '12px', background: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                    onMouseOver={(e) => e.target.style.background = '#0f766e'}
                    onMouseOut={(e) => e.target.style.background = '#0d9488'}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
              No providers match your filter. Try clearing it.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default HealthcareSearch;
