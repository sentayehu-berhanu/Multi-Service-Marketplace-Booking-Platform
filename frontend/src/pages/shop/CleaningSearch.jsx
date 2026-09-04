import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CleaningSearch = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState([]);

  // Form State
  const [serviceType, setServiceType] = useState('House Cleaning');
  const [propertyType, setPropertyType] = useState('House');
  const [size, setSize] = useState('120');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleGetQuote = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Fetch cleaning businesses
      const res = await axios.get('http://localhost:5000/api/businesses?category=cleaning');
      const businesses = res.data;

      // Filter businesses that offer the selected serviceType
      const availableProviders = [];

      businesses.forEach(business => {
        // Find if this business has an active service matching the serviceType
        const matchingService = business.services?.find(
          s => s.status === 'ACTIVE' && s.description && s.description.includes(`[${serviceType}]`)
        );

        if (matchingService) {
          availableProviders.push({
            id: business.id,
            name: business.name,
            rating: business.rating || 4.8,
            jobs: business.review_count || '10+',
            price: `${matchingService.price} ETB`,
            image: matchingService.image || business.cover_image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            matchingService: matchingService
          });
        }
      });

      setProviders(availableProviders);
      setStep(2);
    } catch (error) {
      console.error("Failed to fetch quotes", error);
      alert("Failed to find providers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProvider = (provider) => {
    navigate('/checkout/cleaning', {
      state: {
        provider,
        serviceDetails: {
          serviceType,
          propertyType,
          size,
          date,
          time
        }
      }
    });
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header Banner */}
      <div style={{ background: '#0f172a', padding: '4rem 24px', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.2, background: 'url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80) center/cover' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '3.5rem', margin: '0 0 1rem 0', fontWeight: 800, background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            HOME CLEANING
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
            Professional cleaning services tailored to your property.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '900px', margin: '-3rem auto 3rem', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        
        {step === 1 && (
          <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#0f172a', textAlign: 'center' }}>Get a Free Quote</h2>
            
            <form onSubmit={handleGetQuote} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Service Type */}
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '1rem' }}>What do you need?</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {['House Cleaning', 'Office Cleaning', 'Deep Cleaning', 'Carpet Cleaning', 'Window Cleaning'].map(type => (
                    <div 
                      key={type}
                      onClick={() => setServiceType(type)}
                      style={{ 
                        padding: '12px 20px', 
                        borderRadius: '12px', 
                        border: `2px solid ${serviceType === type ? '#3b82f6' : '#e2e8f0'}`,
                        background: serviceType === type ? '#eff6ff' : 'white',
                        color: serviceType === type ? '#1d4ed8' : '#64748b',
                        fontWeight: serviceType === type ? 'bold' : 'normal',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>

              {/* Property & Size */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '1rem' }}>Property</h3>
                  <select 
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: '#f8fafc' }}
                  >
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Office">Office</option>
                  </select>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '1rem' }}>Size (m²)</h3>
                  <input 
                    type="number" 
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. 120"
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: '#f8fafc' }}
                    required
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '1rem' }}>Date</h3>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: '#f8fafc' }}
                    required
                  />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '1rem' }}>Time</h3>
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: '#f8fafc' }}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                style={{ 
                  marginTop: '1rem',
                  padding: '16px', 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px -10px rgba(59, 130, 246, 0.5)',
                  transition: 'transform 0.2s',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                    Calculating Quotes...
                  </>
                ) : 'GET QUOTE'}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', color: '#0f172a', margin: 0 }}>Available Providers</h2>
              <button 
                onClick={() => setStep(1)}
                style={{ padding: '10px 20px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#64748b' }}
              >
                Edit Details
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {providers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '20px', color: '#64748b' }}>
                  No providers found for the selected service type. Try another option or check back later!
                </div>
              ) : (
                providers.map(provider => (
                  <div key={provider.id} style={{ display: 'flex', background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', transition: '0.2s', ':hover': { transform: 'translateY(-3px)' } }}>
                    <div style={{ width: '200px', background: `url(${provider.image}) center/cover no-repeat` }}></div>
                    <div style={{ padding: '2rem', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      
                      <div>
                        <h3 style={{ fontSize: '1.5rem', margin: '0 0 10px 0', color: '#0f172a' }}>{provider.name}</h3>
                        <div style={{ display: 'flex', gap: '15px', color: '#64748b', marginBottom: '10px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fef08a', color: '#854d0e', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                            ⭐ {provider.rating}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            🧹 {provider.jobs} jobs
                          </span>
                        </div>
                        <p style={{ margin: 0, color: '#94a3b8' }}>Verified Professional • Eco-friendly products</p>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
                          {provider.price}
                        </div>
                        <button 
                          onClick={() => handleSelectProvider(provider)}
                          style={{ padding: '12px 24px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#0f172a'}
                        >
                          SELECT PROVIDER
                        </button>
                      </div>

                    </div>
                  </div>
                ))
              )}
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

export default CleaningSearch;
