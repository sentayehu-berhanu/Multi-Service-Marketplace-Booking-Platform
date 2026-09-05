import React, { useState } from 'react';
import { FiMapPin, FiClock, FiCheck, FiX, FiTool } from 'react-icons/fi';

const initialJobs = [
  {
    id: 1,
    title: 'Kitchen sink repair',
    category: 'Plumber',
    distance: '3 km away',
    preferredTime: '2 PM',
    status: 'pending'
  },
  {
    id: 2,
    title: 'Install new ceiling fan',
    category: 'Electrician',
    distance: '5 km away',
    preferredTime: '4:30 PM',
    status: 'pending'
  }
];

const DashboardRepairJobs = () => {
  const [jobs, setJobs] = useState(initialJobs);

  const handleAccept = (id) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, status: 'accepted' } : job
    ));
  };

  const handleDecline = (id) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, status: 'declined' } : job
    ));
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: 'rgba(107, 70, 193, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent-primary)'
        }}>
          <FiTool size={24} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Repair Jobs</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage incoming service requests</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
        {jobs.filter(job => job.status === 'pending').map((job) => (
          <div key={job.id} className="glass-panel hover-scale" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ 
                  display: 'inline-block', 
                  padding: '4px 12px', 
                  background: 'rgba(233, 30, 99, 0.15)', 
                  color: 'var(--accent-secondary)', 
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  New Job Request
                </span>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem' }}>{job.title}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <span style={{ opacity: 0.8 }}>{job.category}</span>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)' }}>
                <FiMapPin style={{ color: 'var(--accent-primary)' }} />
                <span>📍 {job.distance}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)' }}>
                <FiClock style={{ color: 'var(--accent-secondary)' }} />
                <span>Preferred: {job.preferredTime}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button 
                onClick={() => handleAccept(job.id)}
                className="btn-primary" 
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
              >
                <FiCheck /> Accept Job
              </button>
              <button 
                onClick={() => handleDecline(job.id)}
                className="btn-secondary" 
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
              >
                <FiX /> Decline
              </button>
            </div>
          </div>
        ))}
        {jobs.filter(job => job.status === 'pending').length === 0 && (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '60px 20px', 
            background: 'rgba(255,255,255,0.02)', 
            borderRadius: '16px',
            border: '1px dashed rgba(255,255,255,0.1)'
          }}>
            <FiTool size={48} style={{ color: 'var(--text-secondary)', marginBottom: '16px', opacity: 0.5 }} />
            <h3 style={{ color: 'var(--text-secondary)' }}>No new job requests</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardRepairJobs;
