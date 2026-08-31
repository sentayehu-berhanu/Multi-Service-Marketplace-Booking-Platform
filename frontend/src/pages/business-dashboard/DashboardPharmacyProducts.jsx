import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CATEGORIES = ['Medicine', 'Vitamins', 'Personal Care', 'Baby Care', 'First Aid', 'Dental'];

const DashboardPharmacyProducts = () => {
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
    stock: '',
    category: 'Medicine',
    brand: '',
    requiresPrescription: false,
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
      console.error('Error fetching pharmacy products:', err);
      setError("Failed to load products.");
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
      name: '', description: '', price: '', stock: '', category: 'Medicine', brand: '', requiresPrescription: false, image: '', imageFile: null, status: 'ACTIVE' 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category: product.category || 'Medicine',
      brand: product.brand || '',
      requiresPrescription: product.sku === 'RX_REQUIRED',
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
      submitData.append('stock', formData.stock);
      submitData.append('category', formData.category);
      submitData.append('brand', formData.brand);
      submitData.append('sku', formData.requiresPrescription ? 'RX_REQUIRED' : 'NO_RX'); // Using SKU to store prescription flag
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
      console.error('Error saving product:', err);
      alert('Failed to save product.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchBusinessAndProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product.');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#0ea5e9' }}>Loading inventory...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ textTransform: 'uppercase', color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px' }}>Inventory</span>
          <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0 0 0', color: '#0f172a' }}>Pharmacy Products</h1>
        </div>
        <button 
          onClick={openAddModal}
          style={{ 
            background: '#0ea5e9', color: 'white', border: 'none', padding: '12px 24px', 
            borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.5)'
          }}
        >
          + Add Product
        </button>
      </div>

      <div style={{ padding: '1rem 0' }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', background: 'white', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>💊</span>
            <p style={{ fontSize: '1.2rem' }}>No products found. Add your first medicine or pharmacy item!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {products.map(product => (
              <div key={product.id} style={{ 
                background: 'white', borderRadius: '15px', overflow: 'hidden', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '100%', height: '180px', background: `url(${product.image?.startsWith('/uploads') ? 'http://localhost:5000' + product.image : product.image}) center/cover no-repeat`, borderBottom: '1px solid #e2e8f0' }}></div>
                  {product.sku === 'RX_REQUIRED' && (
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#ef4444', color: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      Rx Required
                    </div>
                  )}
                </div>
                
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {product.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '8px', background: product.stock > 0 ? '#dcfce7' : '#fee2e2', color: product.stock > 0 ? '#166534' : '#991b1b', fontWeight: 'bold' }}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#0f172a' }}>{product.name}</h3>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0ea5e9', marginBottom: '15px' }}>{product.price} ETB</div>
                  
                  <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: 'auto' }}>
                    <button style={{ flex: 1, padding: '8px', background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => openEditModal(product)}>Edit</button>
                    <button style={{ flex: 1, padding: '8px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleDelete(product.id)}>Delete</button>
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
          background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(3px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '600px', padding: '2.5rem', borderRadius: '15px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <h2 style={{ marginBottom: '1.5rem', marginTop: 0, color: '#0f172a' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                  <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', background: 'white' }}>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                  <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Brand</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                  <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Price (ETB)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                  <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Stock Quantity</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required min="0" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }} />
                </div>
              </div>
              
              {/* Prescription Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fef2f2', border: '1px solid #fca5a5', padding: '15px', borderRadius: '8px' }}>
                <input 
                  type="checkbox" 
                  id="requiresPrescription" 
                  name="requiresPrescription" 
                  checked={formData.requiresPrescription} 
                  onChange={handleInputChange}
                  style={{ width: '20px', height: '20px' }}
                />
                <label htmlFor="requiresPrescription" style={{ color: '#991b1b', fontWeight: 'bold', cursor: 'pointer' }}>
                  Requires Prescription (Rx)
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Product Image</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ padding: '10px', border: '1px dashed #cbd5e1', borderRadius: '8px' }} />
                  <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>OR</div>
                  <input type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="Paste Image URL instead..." disabled={!!formData.imageFile} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', opacity: formData.imageFile ? 0.5 : 1 }} />
                </div>
              </div>

              {editingProduct && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' }}>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', background: 'white' }}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPharmacyProducts;
