import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch my businesses to get the business ID
        const bizRes = await axios.get('http://localhost:5000/api/businesses/my', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (bizRes.data.length > 0) {
          const businessId = bizRes.data[0].id;

          // Fetch customers for this business
          const custRes = await axios.get(`http://localhost:5000/api/businesses/${businessId}/customers`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setCustomers(custRes.data);
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers list.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <div>Loading customers...</div>;
  if (error) return <div style={{ color: 'var(--danger)' }}>{error}</div>;

  return (
    <div>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Customers</h2>
      
      {customers.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>You don't have any customers yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {customers.map(customer => (
            <div key={customer.id} className="glass-panel hover-scale" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{customer.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Customer</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  📧 {customer.email}
                </span>
                {customer.phone && (
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    📱 {customer.phone}
                  </span>
                )}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Bookings</span>
                  <span style={{ fontWeight: 'bold' }}>{customer.total_bookings}</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Spent</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>{customer.total_spent} ETB</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardCustomers;
