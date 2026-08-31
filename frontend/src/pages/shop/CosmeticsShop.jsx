import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Skin Care', 'Hair Care', 'Makeup', 'Fragrance', 'Body Care', 'Beauty Tools'];

const CosmeticsShop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(10000);
  
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // We pass the global cosmetics search params if needed
      let url = `http://localhost:5000/api/products?`;
      if (selectedCategory !== 'All') url += `&category=${encodeURIComponent(selectedCategory)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      url += `&maxPrice=${priceRange}`;

      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch cosmetics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, priceRange]); // Fetch when filters change

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    closeProductModal();
  };

  return (
    <div className="container" style={{ padding: '2rem 24px', display: 'flex', gap: '2rem' }}>
      
      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'var(--accent-primary)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 9999,
          fontWeight: 'bold'
        }}>
          🛒 Product added to cart!
        </div>
      )}

      {/* Sidebar Filters */}
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Categories</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {CATEGORIES.map(cat => (
              <li key={cat}>
                <button 
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    padding: 0,
                    textAlign: 'left',
                    width: '100%',
                    transition: 'color 0.2s'
                  }}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>

          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />

          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Price Range</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="range" 
              min="0" 
              max="5000" 
              step="100"
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)} 
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>0 ETB</span>
              <span>Up to {priceRange} ETB</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {/* Header & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '15px', border: 'var(--glass-border)' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', margin: 0 }}>💄 Cosmetics Shop</h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Discover premium beauty and skincare products.</p>
          </div>
          
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', width: '400px' }}>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-panel"
              style={{ flex: 1, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', outline: 'none' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0 1.5rem', borderRadius: '10px' }}>Search</button>
          </form>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: '15px', border: 'var(--glass-border)' }}>
            <h3>No products found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {products.map(product => (
              <div key={product.id} className="glass-panel hover-scale" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div 
                  style={{ height: '250px', background: `url(${product.image?.startsWith('/uploads') ? 'http://localhost:5000' + product.image : product.image}) center/cover no-repeat`, cursor: 'pointer' }}
                  onClick={() => openProductModal(product)}
                />
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                      {product.brand || product.category || 'Cosmetics'}
                    </span>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '6px', fontSize: '0.8rem' }}>
                      ⭐ {product.rating || 'New'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', margin: '0 0 1rem 0', cursor: 'pointer' }} onClick={() => openProductModal(product)}>
                    {product.name}
                  </h3>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{product.price} ETB</span>
                    <button onClick={() => openProductModal(product)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>View</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }} onClick={closeProductModal}>
          <div 
            className="glass-panel" 
            style={{ 
              maxWidth: '1000px', 
              width: '100%', 
              background: '#111827', 
              display: 'flex', 
              borderRadius: '20px', 
              overflow: 'hidden',
              position: 'relative'
            }} 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={closeProductModal}
              style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer', zIndex: 10 }}
            >×</button>

            {/* Left side: Large Image */}
            <div style={{ flex: '1 1 50%', background: `url(${selectedProduct.image?.startsWith('/uploads') ? 'http://localhost:5000' + selectedProduct.image : selectedProduct.image}) center/cover no-repeat`, minHeight: '500px' }} />

            {/* Right side: Details */}
            <div style={{ flex: '1 1 50%', padding: '3rem', display: 'flex', flexDirection: 'column', maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  {selectedProduct.brand || selectedProduct.category || 'Cosmetics'}
                </span>
                <span style={{ fontSize: '1.2rem', color: '#FFD700' }}>⭐ {selectedProduct.rating || '4.5'} ({selectedProduct.review_count || 0} reviews)</span>
              </div>
              
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{selectedProduct.name}</h2>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>{selectedProduct.price} ETB</p>

              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Description</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
                {selectedProduct.description || 'Experience the best of beauty with our premium product line.'}
              </p>

              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Ingredients</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
                Aqua (Water), Glycerin, Hyaluronic Acid, Vitamin E, Natural Extracts, Fragrance.
              </p>

              {/* Quantity & Actions */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 'bold' }}>Quantity:</span>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{ background: 'none', border: 'none', color: 'white', padding: '10px 15px', cursor: 'pointer', fontSize: '1.2rem' }}
                    >-</button>
                    <span style={{ padding: '0 15px', fontWeight: 'bold' }}>{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      style={{ background: 'none', border: 'none', color: 'white', padding: '10px 15px', cursor: 'pointer', fontSize: '1.2rem' }}
                    >+</button>
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: 'auto' }}>
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    onClick={handleAddToCart}
                    className="btn-secondary" 
                    style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '10px' }}
                    disabled={selectedProduct.stock === 0}
                  >
                    🛒 ADD TO CART
                  </button>
                  <button 
                    onClick={handleAddToCart}
                    className="btn-primary" 
                    style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}
                    disabled={selectedProduct.stock === 0}
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CosmeticsShop;
