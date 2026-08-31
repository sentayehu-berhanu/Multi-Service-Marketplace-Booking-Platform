import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CATEGORIES = ['Skin Care', 'Hair Care', 'Makeup', 'Fragrance', 'Body Care', 'Beauty Tools'];

const DashboardProducts = () => {
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
    category: 'Skin Care',
    brand: '',
    rating: '',
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
      // Fetch the business first
      const bizRes = await axios.get('http://localhost:5000/api/businesses/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (bizRes.data && bizRes.data.length > 0) {
        const business = bizRes.data[0];
        setBusinessId(business.id);
        
        // Fetch products for this business
        const prodRes = await axios.get(`http://localhost:5000/api/products?businessId=${business.id}`);
        // Filter out archived products if API doesn't do it (it should though)
        setProducts(prodRes.data.filter(p => p.status !== 'ARCHIVED'));
      } else {
        setError("No business found. Please create a business first.");
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ 
      name: '', description: '', price: '', stock: '', category: 'Skin Care', brand: '', rating: '', image: '', imageFile: null, status: 'ACTIVE' 
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
      category: product.category || 'Skin Care',
      brand: product.brand || '',
      rating: product.rating || '',
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
      if (formData.rating) submitData.append('rating', formData.rating);
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

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading products...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Products Management</h1>
        <button className="btn-primary hover-scale" onClick={openAddModal}>+ Add Product</button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No products found. Add your first cosmetic product!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {products.map(product => (
              <div key={product.id} className="category-card hover-scale" style={{ alignItems: 'flex-start', textAlign: 'left', padding: 0, cursor: 'default', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', height: '180px', background: `url(${product.image?.startsWith('/uploads') ? 'http://localhost:5000' + product.image : product.image}) center/cover no-repeat`, borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}></div>
                <div style={{ padding: '1.5rem', width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {product.brand || product.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '8px', background: product.stock > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: product.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{product.name}</h3>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px' }}>{product.price} ETB</div>
                  
                  <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: 'auto' }}>
                    <button className="btn-secondary" style={{ flex: 1, padding: '8px' }} onClick={() => openEditModal(product)}>Edit</button>
                    <button className="btn-secondary" style={{ flex: 1, padding: '8px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={() => handleDelete(product.id)}>Delete</button>
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
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem', marginTop: 0 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', padding: '10px' }}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Brand</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Price (ETB)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Stock Quantity</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required min="0" />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label>Product Image</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ background: 'transparent', border: '1px dashed var(--glass-border)', padding: '10px' }} />
                  <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>OR</div>
                  <input type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="Paste Image URL instead..." disabled={!!formData.imageFile} style={{ opacity: formData.imageFile ? 0.5 : 1 }} />
                </div>
              </div>

              {editingProduct && (
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary hover-scale" style={{ flex: 1 }} onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary hover-scale" style={{ flex: 1 }}>{editingProduct ? 'Save Changes' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardProducts;
