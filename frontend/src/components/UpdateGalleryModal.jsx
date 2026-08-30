import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateGalleryModal = ({ isOpen, onClose, businessId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form data for upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    if (isOpen && businessId) {
      fetchGallery();
    }
  }, [isOpen, businessId]);

  const fetchGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/businesses/${businessId}/gallery`);
      setImages(res.data);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
      setError('Failed to load gallery images.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('imageFile', selectedFile);
    if (caption) {
      formData.append('caption', caption);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/businesses/${businessId}/gallery`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Add newly uploaded image to the list
      setImages([res.data.image, ...images]);
      
      // Reset form
      setSelectedFile(null);
      setCaption('');
      document.getElementById('gallery-file-input').value = '';
      
    } catch (err) {
      console.error('Failed to upload image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/businesses/${businessId}/gallery/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from UI
      setImages(images.filter(img => img.id !== imageId));
    } catch (err) {
      console.error('Failed to delete image:', err);
      setError('Failed to delete image.');
    }
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
      <div className="glass-panel" style={{ width: '90%', maxWidth: '800px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Business Gallery</h2>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '10px', background: 'rgba(255,107,107,0.1)', borderRadius: '8px' }}>{error}</div>}

        {/* Upload Form */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Upload New Photo</h3>
          <form onSubmit={handleUpload} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Select Image</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="file" 
                  id="gallery-file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ opacity: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 2 }}
                  required
                />
                <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: selectedFile ? 'rgba(107, 70, 193, 0.1)' : 'rgba(255,255,255,0.05)', borderColor: selectedFile ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '1.2rem' }}>🖼️</span>
                  <span style={{ color: selectedFile ? 'var(--text-primary)' : 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedFile ? selectedFile.name : 'Choose a file...'}
                  </span>
                </div>
              </div>
            </div>
            
            <div style={{ flex: '2 1 300px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Caption (Optional)</label>
              <input 
                type="text" 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Our new storefront!"
                className="input-field"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={uploading || !selectedFile} style={{ height: '42px' }}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading gallery...</p>
        ) : images.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
            <span style={{ fontSize: '3rem' }}>📸</span>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Your gallery is empty. Upload some photos to show off your business!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {images.map(img => (
              <div key={img.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1/1', background: 'var(--bg-primary)' }}>
                <img 
                  src={img.image_url} 
                  alt={img.caption || 'Gallery image'} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                
                {img.caption && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', padding: '10px', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {img.caption}
                    </p>
                  </div>
                )}

                <button 
                  onClick={() => handleDelete(img.id)}
                  style={{ 
                    position: 'absolute', top: '8px', right: '8px', 
                    background: 'rgba(239, 68, 68, 0.9)', color: 'white', 
                    border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', 
                    width: '32px', height: '32px', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s', backdropFilter: 'blur(4px)'
                  }}
                  title="Delete image"
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = 'var(--danger)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)'; }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default UpdateGalleryModal;
