import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CATEGORIES = ['Coffee', 'Food', 'Pastries', 'Drinks', 'Dessert'];

const DashboardCafeMenu = () => {
  const [products, setProducts] = useState([]);
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    isAvailable: true,
    category: 'Coffee',
    image: '',
    imageFile: null,
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchBusinessAndProducts();
  }, []);

  const fetchBusinessAndProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const bizRes = await axios.get('http://localhost:5000/api/businesses/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (bizRes.data && bizRes.data.length > 0) {
        const business = bizRes.data[0];
        setBusinessId(business.id);
        
        const prodRes = await axios.get(`http://localhost:5000/api/products?businessId=${business.id}`);
        setProducts(prodRes.data.filter(p => p.status !== 'ARCHIVED'));
      } else {
        setError("No business found. Please create a business first.");
      }
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError("Failed to load menu.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ 
      name: '', description: '', price: '', isAvailable: true, category: 'Coffee', image: '', imageFile: null, status: 'ACTIVE' 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      isAvailable: product.stock > 0,
      category: product.category || 'Coffee',
      image: product.image || '',
      imageFile: null,
      status: product.status
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('stock', formData.isAvailable ? 100 : 0); // Hack to use stock field for availability
      submitData.append('category', formData.category);
      if (formData.status) submitData.append('status', formData.status);
      
      if (formData.imageFile) {
        submitData.append('imageFile', formData.imageFile);
      } else if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:5000/api/businesses/${businessId}/products`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      closeModal();
      fetchBusinessAndProducts();
    } catch (err) {
      console.error('Error saving menu item:', err);
      alert('Failed to save menu item.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this item from your menu?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchBusinessAndProducts();
      } catch (err) {
        console.error('Error deleting menu item:', err);
        alert('Failed to delete item.');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#78350f' }}>Loading Menu...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ textTransform: 'uppercase', color: '#92400e', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px' }}>Dashboard</span>
          <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0 0 0', color: '#451a03' }}>Café Menu</h1>
        </div>
        <button 
          onClick={openAddModal}
          style={{ 
            background: '#78350f', color: 'white', border: 'none', padding: '12px 24px', 
            borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(120, 53, 15, 0.5)'
          }}
        >
          + Add Menu Item
        </button>
      </div>

      <div style={{ padding: '1rem 0' }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#78350f', background: 'white', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #fde68a' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>☕</span>
            <p style={{ fontSize: '1.2rem' }}>Your menu is empty. Add your first coffee or food item!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {products.map(product => (
              <div key={product.id} style={{ 
                background: 'white', borderRadius: '15px', overflow: 'hidden', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column',
                border: '1px solid #fef3c7'
              }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '100%', height: '180px', background: product.image ? `url(${product.image?.startsWith('/uploads') ? 'http://localhost:5000' + product.image : product.image}) center/cover no-repeat` : '#fef3c7', borderBottom: '1px solid #fde68a' }}></div>
                </div>
                
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {product.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '8px', background: product.stock > 0 ? '#dcfce7' : '#fee2e2', color: product.stock > 0 ? '#166534' : '#991b1b', fontWeight: 'bold' }}>
                      {product.stock > 0 ? `Available` : 'Sold Out'}
                    </span>
                  </div>
                  
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#451a03' }}>{product.name}</h3>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#78350f', marginBottom: '15px' }}>{product.price} ETB</div>
                  
                  <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: 'auto' }}>
                    <button style={{ flex: 1, padding: '8px', background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => openEditModal(product)}>Edit</button>
                    <button style={{ flex: 1, padding: '8px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleDelete(product.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(69, 26, 3, 0.7)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '600px', padding: '2.5rem', borderRadius: '15px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <h2 style={{ marginBottom: '1.5rem', marginTop: 0, color: '#451a03' }}>{editingProduct ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#78350f', fontWeight: 'bold', fontSize: '0.9rem' }}>Item Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #fcd34d', fontSize: '1rem', outline: 'none' }} placeholder="e.g. Latte" />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#78350f', fontWeight: 'bold', fontSize: '0.9rem' }}>Description (Optional)</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="2" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #fcd34d', fontSize: '1rem', outline: 'none' }}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                  <label style={{ color: '#78350f', fontWeight: 'bold', fontSize: '0.9rem' }}>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #fcd34d', fontSize: '1rem', background: 'white' }}>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                  <label style={{ color: '#78350f', fontWeight: 'bold', fontSize: '0.9rem' }}>Price (ETB)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #fcd34d', fontSize: '1rem' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fef3c7', border: '1px solid #fde68a', padding: '15px', borderRadius: '8px' }}>
                <input 
                  type="checkbox" 
                  id="isAvailable" 
                  name="isAvailable" 
                  checked={formData.isAvailable} 
                  onChange={handleInputChange}
                  style={{ width: '20px', height: '20px' }}
                />
                <label htmlFor="isAvailable" style={{ color: '#92400e', fontWeight: 'bold', cursor: 'pointer' }}>
                  Currently Available (In Stock)
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#78350f', fontWeight: 'bold', fontSize: '0.9rem' }}>Item Image</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ padding: '10px', border: '1px dashed #fcd34d', borderRadius: '8px' }} />
                  <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#92400e' }}>OR</div>
                  <input type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="Paste Image URL instead..." disabled={!!formData.imageFile} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #fcd34d', fontSize: '1rem', opacity: formData.imageFile ? 0.5 : 1 }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '12px', background: '#fffbeb', color: '#78350f', border: '1px solid #fde68a', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#78350f', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {editingProduct ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCafeMenu;
