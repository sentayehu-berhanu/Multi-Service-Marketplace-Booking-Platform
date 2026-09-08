import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiImage } from 'react-icons/fi';

const DashboardTutorServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState(null);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Tutoring', // Tutoring or Course
    duration: '', // e.g. "60 min" or "12 Weeks"
    lessons: '', // e.g. "48" (for courses)
    price: '',
    image: '',
    category: '', // e.g. COMPUTER, LANGUAGE
    mode: 'Online', // Online or Physical
    whatYouWillLearn: '', // Comma separated
    courseContent: '', // Line separated
    availableDays: [] // e.g. ['Mon', 'Wed', 'Fri']
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const bizRes = await axios.get('http://localhost:5000/api/businesses/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const biz = bizRes.data[0];
      if (biz) {
        setBusinessId(biz.id);
        const servRes = await axios.get(`http://localhost:5000/api/businesses/${biz.id}/services`);
        setServices(servRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleEdit = (service) => {
    let parsedData = {
      type: 'Tutoring',
      duration: '',
      lessons: '',
      category: '',
      mode: 'Online',
      whatYouWillLearn: '',
      courseContent: '',
      availableDays: []
    };

    if (service.description) {
      if (service.description.startsWith('{')) {
        try {
          const json = JSON.parse(service.description);
          parsedData.type = json.type || 'Tutoring';
          parsedData.duration = json.durationString || '';
          parsedData.lessons = json.lessons || '';
          parsedData.category = json.category || '';
          parsedData.mode = json.mode || 'Online';
          parsedData.whatYouWillLearn = (json.whatYouWillLearn || []).join(', ');
          parsedData.courseContent = (json.courseContent || []).join('\n');
          parsedData.availableDays = json.availableDays || [];
        } catch (e) {
          console.error("Failed to parse JSON description", e);
        }
      } else if (service.description.includes('|')) {
        // Legacy fallback
        const parts = service.description.split('|');
        parsedData.type = parts[0];
        parsedData.duration = parts[1];
        parsedData.lessons = parts[2] || '';
      }
    } else {
      if (service.name.toLowerCase().includes('course') || service.name.toLowerCase().includes('bootcamp')) {
        parsedData.type = 'Course';
      }
    }

    setFormData({
      name: service.name,
      price: service.price,
      image: service.image || '',
      type: parsedData.type,
      duration: parsedData.duration,
      lessons: parsedData.lessons,
      category: parsedData.category,
      mode: parsedData.mode,
      whatYouWillLearn: parsedData.whatYouWillLearn,
      courseContent: parsedData.courseContent,
      availableDays: parsedData.availableDays
    });
    setEditingId(service.id);
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const metaData = {
        type: formData.type,
        durationString: formData.duration,
        lessons: formData.lessons,
        category: formData.category,
        mode: formData.mode,
        whatYouWillLearn: formData.whatYouWillLearn.split(',').map(s => s.trim()).filter(Boolean),
        courseContent: formData.courseContent.split('\n').map(s => s.trim()).filter(Boolean),
        availableDays: formData.availableDays
      };

      const payload = {
        name: formData.name,
        description: JSON.stringify(metaData),
        price: parseFloat(formData.price),
        image: formData.image,
        duration: formData.type === 'Tutoring' ? parseInt(formData.duration) || 60 : 0
      };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/businesses/${businessId}/services/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5000/api/businesses/${businessId}/services`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setFormData({ 
        name: '', type: 'Tutoring', duration: '', lessons: '', price: '', image: '', 
        category: '', mode: 'Online', whatYouWillLearn: '', courseContent: '', availableDays: [] 
      });
      setShowAddForm(false);
      setEditingId(null);
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to save program:', error);
      alert('Failed to save program');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/businesses/${businessId}/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete program:', error);
      alert('Failed to delete program');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading programs...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>🎓 Programs</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage your 1-on-1 tutoring subjects and comprehensive training courses.</p>
        </div>
        <button className="btn-primary" onClick={() => {
          setEditingId(null);
          setFormData({ 
            name: '', type: 'Tutoring', duration: '', lessons: '', price: '', image: '', 
            category: '', mode: 'Online', whatYouWillLearn: '', courseContent: '', availableDays: [] 
          });
          setShowAddForm(!showAddForm);
        }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPlus /> Add Program
        </button>
      </div>

      {showAddForm && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>{editingId ? 'Edit Program' : 'Add New Program'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Program Type</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: formData.type === 'Tutoring' ? 'rgba(79, 70, 229, 0.1)' : 'transparent', padding: '10px 16px', borderRadius: '8px', border: `1px solid ${formData.type === 'Tutoring' ? '#4f46e5' : '#cbd5e1'}` }}>
                  <input type="radio" name="type" value="Tutoring" checked={formData.type === 'Tutoring'} onChange={handleInputChange} style={{ width: 'auto', display: 'none' }} />
                  👨‍🏫 1-on-1 Tutoring
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: formData.type === 'Course' ? 'rgba(79, 70, 229, 0.1)' : 'transparent', padding: '10px 16px', borderRadius: '8px', border: `1px solid ${formData.type === 'Course' ? '#4f46e5' : '#cbd5e1'}` }}>
                  <input type="radio" name="type" value="Course" checked={formData.type === 'Course'} onChange={handleInputChange} style={{ width: 'auto', display: 'none' }} />
                  📚 Training Course
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>{formData.type === 'Tutoring' ? 'Subject Name (e.g. High School Math)' : 'Course Title (e.g. React Bootcamp)'}</label>
              <input type="text" name="name" className="input-field" required value={formData.name} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>{formData.type === 'Tutoring' ? 'Hourly Rate (ETB)' : 'Total Course Price (ETB)'}</label>
              <input type="number" name="price" className="input-field" required value={formData.price} onChange={handleInputChange} />
            </div>
            
            <div className="form-group">
              <label>Image URL (Thumbnail)</label>
              <div style={{ position: 'relative' }}>
                <FiImage style={{ position: 'absolute', left: '12px', top: '15px', color: '#64748b' }} />
                <input type="url" name="image" className="input-field" value={formData.image} onChange={handleInputChange} placeholder="https://example.com/image.jpg" style={{ paddingLeft: '40px' }} />
              </div>
            </div>

            <div className="form-group">
              <label>Learning Mode</label>
              <select name="mode" className="input-field" value={formData.mode} onChange={handleInputChange}>
                <option value="Online">🟢 Online</option>
                <option value="Physical">📍 Physical / In-Person</option>
                <option value="Hybrid">🟡 Hybrid</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" className="input-field" value={formData.category} onChange={handleInputChange} required>
                <option value="" disabled>Select a category</option>
                <option value="ACADEMIC TUTOR">📚 Academic Tutor</option>
                <option value="LANGUAGE">🌍 Language</option>
                <option value="COMPUTER">💻 Computer</option>
                <option value="DRIVING">🚗 Driving</option>
                <option value="PROFESSIONAL SKILLS">🎓 Professional Skills</option>
              </select>
            </div>

            <div className="form-group">
              <label>{formData.type === 'Tutoring' ? 'Session Duration (e.g. 60 min)' : 'Total Duration (e.g. 12 Weeks)'}</label>
              <input type="text" name="duration" className="input-field" required value={formData.duration} onChange={handleInputChange} />
            </div>

            {formData.type === 'Tutoring' && (
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Available Days</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <button
                      type="button"
                      key={day}
                      onClick={() => handleDayToggle(day)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: `1px solid ${formData.availableDays.includes(day) ? '#4f46e5' : '#cbd5e1'}`,
                        background: formData.availableDays.includes(day) ? '#4f46e5' : 'transparent',
                        color: formData.availableDays.includes(day) ? 'white' : 'var(--text-primary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {formData.type === 'Course' && (
              <div className="form-group">
                <label>Total Lessons</label>
                <input type="text" name="lessons" className="input-field" required value={formData.lessons} onChange={handleInputChange} placeholder="e.g. 48" />
              </div>
            )}

            {formData.type === 'Course' && (
              <>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>What You Will Learn (Comma Separated)</label>
                  <textarea name="whatYouWillLearn" className="input-field" value={formData.whatYouWillLearn} onChange={handleInputChange} placeholder="HTML & CSS, JavaScript, React, Node.js" rows="2" style={{ resize: 'vertical' }}></textarea>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Course Syllabus / Content (One per line)</label>
                  <textarea name="courseContent" className="input-field" value={formData.courseContent} onChange={handleInputChange} placeholder="01 HTML Basics&#10;02 JavaScript Fundamentals&#10;03 React Components" rows="4" style={{ resize: 'vertical' }}></textarea>
                </div>
              </>
            )}

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
              <button type="button" className="btn-secondary" onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
              }}>Cancel</button>
              <button type="submit" className="btn-primary">{editingId ? 'Update Program' : 'Save Program'}</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {services.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No programs added yet.
          </div>
        ) : (
          services.map(service => {
            let type = 'Tutoring';
            let duration = '';
            let lessons = '';
            let category = '';
            let mode = '';
            let availableDays = [];
            
            if (service.description) {
              if (service.description.startsWith('{')) {
                try {
                  const json = JSON.parse(service.description);
                  type = json.type || 'Tutoring';
                  duration = json.durationString || '';
                  lessons = json.lessons || '';
                  category = json.category || '';
                  mode = json.mode || '';
                  availableDays = json.availableDays || [];
                } catch (e) {}
              } else if (service.description.includes('|')) {
                const parts = service.description.split('|');
                type = parts[0];
                duration = parts[1];
                lessons = parts[2] || '';
              }
            }

            const isCourse = type === 'Course';

            return (
              <div key={service.id} className="glass-panel hover-scale" style={{ padding: '0', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {service.image && (
                  <div style={{ height: '140px', width: '100%', background: `url(${service.image}) center/cover` }}></div>
                )}
                
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, background: isCourse ? 'rgba(14, 165, 233, 0.9)' : 'rgba(16, 185, 129, 0.9)', color: 'white', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 600, borderRadius: '0 0 0 12px', backdropFilter: 'blur(4px)' }}>
                    {type}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', marginTop: service.image ? '0' : '1rem' }}>
                    <div>
                      {category && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0ea5e9', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>{category}</span>}
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', paddingRight: '40px', color: 'var(--text-primary)' }}>{service.name}</h3>
                      <div style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <span>⏱️ {duration}</span>
                        {isCourse && lessons && <span>📚 {lessons} Lessons</span>}
                        {mode && <span>{mode === 'Online' ? '🟢' : '📍'} {mode}</span>}
                      </div>
                      {!isCourse && availableDays.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                          {availableDays.map(day => (
                            <span key={day} style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {day}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                      {service.price} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>ETB {!isCourse && '/ hour'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-secondary" style={{ padding: '6px' }} title="Edit" onClick={() => handleEdit(service)}>
                        <FiEdit2 size={16} />
                      </button>
                      <button className="btn-secondary" style={{ padding: '6px', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }} title="Delete" onClick={() => handleDelete(service.id)}>
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DashboardTutorServices;
