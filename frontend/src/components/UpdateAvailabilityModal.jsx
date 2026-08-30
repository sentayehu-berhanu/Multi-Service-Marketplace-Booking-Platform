import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

const DEFAULT_HOURS = DAYS_OF_WEEK.map(day => ({
  day_of_week: day.value,
  open_time: '09:00',
  close_time: '17:00',
  is_closed: day.value === 0 || day.value === 6 // Closed on weekends by default
}));

const UpdateAvailabilityModal = ({ isOpen, onClose, businessId }) => {
  const [schedule, setSchedule] = useState(DEFAULT_HOURS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && businessId) {
      fetchAvailability();
    }
  }, [isOpen, businessId]);

  const fetchAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/businesses/${businessId}/hours`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data && res.data.length > 0) {
        // Merge fetched hours with missing days
        const fetchedMap = new Map(res.data.map(h => [h.day_of_week, h]));
        const mergedSchedule = DAYS_OF_WEEK.map(day => {
          if (fetchedMap.has(day.value)) {
            const h = fetchedMap.get(day.value);
            return {
              day_of_week: h.day_of_week,
              open_time: h.open_time,
              close_time: h.close_time,
              is_closed: h.is_closed
            };
          }
          return DEFAULT_HOURS.find(d => d.day_of_week === day.value);
        });
        setSchedule(mergedSchedule);
      } else {
        setSchedule(DEFAULT_HOURS);
      }
    } catch (err) {
      console.error('Failed to fetch availability:', err);
      setError('Failed to load your current schedule.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/businesses/${businessId}/hours`, { hours: schedule }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onClose(); // Close modal on success
    } catch (err) {
      console.error('Failed to save availability:', err);
      setError('Failed to save your schedule.');
    } finally {
      setSaving(false);
    }
  };

  const handleDayChange = (dayValue, field, value) => {
    setSchedule(prev => prev.map(day => {
      if (day.day_of_week === dayValue) {
        return { ...day, [field]: value };
      }
      return day;
    }));
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '700px', padding: '2.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', textAlign: 'center' }}>Set Standard Hours</h2>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '10px', background: 'rgba(255,107,107,0.1)', borderRadius: '8px' }}>{error}</div>}

        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading schedule...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
            {schedule.map(day => {
              const dayLabel = DAYS_OF_WEEK.find(d => d.value === day.day_of_week).label;
              return (
                <div key={day.day_of_week} className="day-row" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '15px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: day.is_closed ? '4px solid var(--glass-border)' : '4px solid var(--success)' }}>
                  
                  <div style={{ width: '120px', fontWeight: '600', fontSize: '1.1rem', color: day.is_closed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                    {dayLabel}
                  </div>

                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={day.is_closed}
                          onChange={(e) => handleDayChange(day.day_of_week, 'is_closed', e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                      <span style={{ color: day.is_closed ? 'var(--danger)' : 'var(--text-secondary)', fontWeight: day.is_closed ? '500' : 'normal' }}>
                        {day.is_closed ? 'Closed' : 'Open'}
                      </span>
                    </div>

                    {!day.is_closed && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
                        <input 
                          type="time" 
                          value={day.open_time} 
                          onChange={(e) => handleDayChange(day.day_of_week, 'open_time', e.target.value)}
                          className="time-input"
                        />
                        <span style={{ color: 'var(--text-secondary)', margin: '0 5px' }}>to</span>
                        <input 
                          type="time" 
                          value={day.close_time} 
                          onChange={(e) => handleDayChange(day.day_of_week, 'close_time', e.target.value)}
                          className="time-input"
                        />
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
          <button className="btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={loading || saving}>
            {saving ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAvailabilityModal;
