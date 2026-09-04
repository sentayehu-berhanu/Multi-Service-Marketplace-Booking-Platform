import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MOCK_SERVICES = [
  { id: 1, name: 'Basic Wash', price: 150, duration: 30, category: 'Car Wash', description: 'Exterior wash and tire shine.' },
  { id: 2, name: 'Premium Wash', price: 400, duration: 60, category: 'Car Wash', description: 'Exterior wash, interior vacuum, and wax.' },
  { id: 3, name: 'Full Detailing', price: 800, duration: 180, category: 'Detailing', description: 'Complete interior and exterior deep clean and polish.' },
  { id: 4, name: 'Interior Cleaning', price: 300, duration: 60, category: 'Car Wash', description: 'Deep vacuum, seat cleaning, and dashboard wipe down.' },
  { id: 5, name: 'Oil Change', price: 1200, duration: 45, category: 'Oil Change', description: 'Premium synthetic oil change and filter replacement.' },
];

const AutoServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selection state
  const [selectedService, setSelectedService] = useState(null);
  
  // Booking Info
  const [vehicleModel, setVehicleModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [reserveDate, setReserveDate] = useState('');
  const [reserveTime, setReserveTime] = useState('');

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const numId = parseInt(id);
        if (numId >= 500) {
          // Mock data
          setBusiness({
            id: numId,
            name: numId === 501 ? 'Shine Car Wash' : 'Auto Service Pro',
            rating: 4.8,
            address: 'Bole, Addis Ababa',
            category: 'Auto Services',
            gallery: [
              'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ]
          });
          setServices(MOCK_SERVICES);
        } else {
          // DB Data
          const res = await axios.get('http://localhost:5000/api/businesses');
          const found = res.data.find(b => b.id === numId);
          if (found) {
            setBusiness({
              ...found,
              gallery: [
                found.cover_image || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              ]
            });
            
            // Try fetching services
            try {
              const servRes = await axios.get(`http://localhost:5000/api/businesses/${found.id}/services`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              }).catch(() => null);
              
              if (servRes && servRes.data.length > 0) {
                setServices(servRes.data.filter(s => s.status !== 'ARCHIVED'));
              } else if (found.services && found.services.length > 0) {
                setServices(found.services);
              } else {
                setServices(MOCK_SERVICES);
              }
            } catch(e) { 
              setServices(MOCK_SERVICES);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch business", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id]);

  const handleBookService = () => {
    if (!selectedService) return alert('Please select a service.');
    if (!vehicleModel || !licensePlate) return alert('Please enter your vehicle model and license plate.');
    if (!reserveDate || !reserveTime) return alert('Please select a date and time.');
    
    // Instead of creating a whole new checkout page, we'll route to the generic BusinessCheckoutFlow
    // or RestaurantCheckoutFlow (we can adapt BusinessCheckoutFlow)
    // Actually, BusinessCheckoutFlow doesn't support cart arrays easily if not built for it, 
    // but we have a single service selected here.
    navigate('/checkout', {
      state: { 
        business, 
        service: selectedService, 
        date: reserveDate, 
        time: reserveTime, 
        vehicleInfo: `${vehicleModel} (Plate: ${licensePlate})`,
        type: 'auto'
      }
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Services...</div>;
  if (!business) return <div style={{ textAlign: 'center', padding: '4rem' }}>Business not found</div>;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header Info */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 24px 1rem 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Link to="/shop/auto" style={{ color: '#64748b', textDecoration: 'none', display: 'inline-block', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 'bold' }}>← BACK TO SEARCH</Link>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: '#0f172a' }}>{business.name}</h1>
            <div style={{ color: '#64748b', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span>📍 {business.address || business.location || 'Addis Ababa'}</span>
              <span style={{ color: '#2563eb', fontWeight: 'bold' }}>⭐ {business.rating || '4.8'}</span>
              <span>🚗 {typeof business.category === 'object' ? business.category.name : (business.category || 'Auto Services')}</span>
            </div>
          </div>
          <button style={{ background: 'white', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#0f172a' }}>
            ♡ Save
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 2rem 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '200px 200px', gap: '10px', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ gridRow: '1 / 3', background: `url(${business.gallery[0]}) center/cover no-repeat` }}></div>
          <div style={{ background: `url(${business.gallery[1]}) center/cover no-repeat` }}></div>
          <div style={{ background: `url(${business.gallery[2]}) center/cover no-repeat` }}></div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 4rem 24px', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Left Content Area - Services */}
        <div style={{ flex: '1 1 600px' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '1.5rem' }}>Select Service</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {services.map(service => (
              <div 
                key={service.id} 
                onClick={() => setSelectedService(service)}
                style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: selectedService?.id === service.id ? '#eff6ff' : 'white', 
                  borderRadius: '12px', padding: '1.5rem', 
                  border: selectedService?.id === service.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  cursor: 'pointer', transition: '0.2s',
                  boxShadow: selectedService?.id === service.id ? '0 10px 15px -3px rgba(37,99,235,0.1)' : '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#0f172a' }}>{service.name}</h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 10px 0' }}>
                    {service.description ? service.description.replace(/^\[.*?\] /, '') : ''}
                  </p>
                  <div style={{ color: '#475569', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>⏱️ {service.duration || 60} mins</span>
                    {service.description?.match(/^\[(.*?)\]/) && (
                      <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        🚗 {service.description.match(/^\[(.*?)\]/)[1]}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', marginLeft: '20px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2563eb' }}>{service.price} ETB</div>
                  <div style={{ 
                    marginTop: '10px', width: '24px', height: '24px', borderRadius: '50%', 
                    border: selectedService?.id === service.id ? '6px solid #2563eb' : '2px solid #cbd5e1',
                    background: 'white', display: 'inline-block'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Booking Widget */}
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', border: '1px solid #e2e8f0', position: 'sticky', top: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' }}>
            
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              Service Booking
            </h3>
            
            {/* Vehicle Details */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#475569', fontSize: '1rem' }}>Vehicle Information</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Vehicle Model (e.g., Toyota Corolla)" 
                  value={vehicleModel} 
                  onChange={e => setVehicleModel(e.target.value)} 
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
                />
                <input 
                  type="text" 
                  placeholder="License Plate (e.g., ABC-1234)" 
                  value={licensePlate} 
                  onChange={e => setLicensePlate(e.target.value)} 
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
                />
              </div>
            </div>

            {/* Date & Time */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#475569', fontSize: '1rem' }}>Appointment</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <input 
                    type="date" 
                    value={reserveDate} 
                    onChange={e => setReserveDate(e.target.value)} 
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input 
                    type="time" 
                    value={reserveTime} 
                    onChange={e => setReserveTime(e.target.value)} 
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} 
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#475569' }}>
                <span>Service</span>
                <span style={{ fontWeight: 'bold' }}>{selectedService ? selectedService.name : '--'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 'bold', color: '#0f172a' }}>Total</span>
                <span style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '1.2rem' }}>{selectedService ? `${selectedService.price} ETB` : '0 ETB'}</span>
              </div>
            </div>

            <button 
              onClick={handleBookService}
              style={{ width: '100%', padding: '15px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: '0.2s' }}
              onMouseOver={(e) => e.target.style.background = '#1e293b'}
              onMouseOut={(e) => e.target.style.background = '#0f172a'}
            >
              BOOK SERVICE
            </button>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginTop: '10px' }}>
              You will complete payment details on the next step.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AutoServiceDetail;
