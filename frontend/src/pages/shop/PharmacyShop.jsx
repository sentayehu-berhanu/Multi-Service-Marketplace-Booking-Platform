import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PharmacyShop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Medicine', 'Vitamins', 'Personal Care', 'Baby Care', 'First Aid', 'Dental'];

  const MOCK_PRODUCTS = [
    { id: 101, name: 'Vitamin C 1000mg', category: 'Vitamins', price: 250, stock: true, requiresPrescription: false, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
    { id: 102, name: 'Amoxicillin 500mg', category: 'Medicine', price: 150, stock: true, requiresPrescription: true, image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
    { id: 103, name: 'Digital Thermometer', category: 'First Aid', price: 800, stock: true, requiresPrescription: false, image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
    { id: 104, name: 'Baby Lotion', category: 'Baby Care', price: 350, stock: false, requiresPrescription: false, image: 'https://images.unsplash.com/photo-1555252834-8c83c0767073?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
    { id: 105, name: 'Paracetamol 500mg', category: 'Medicine', price: 50, stock: true, requiresPrescription: false, image: 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
    { id: 106, name: 'Fluoride Toothpaste', category: 'Dental', price: 120, stock: true, requiresPrescription: false, image: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' }
  ];

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', padding: '4rem 24px', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>Pharmacy</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem' }}>Health and wellness products delivered to your door.</p>
        
        <input 
          type="text" 
          placeholder="Search medicine, vitamins, personal care..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            width: '100%', maxWidth: '600px', padding: '15px 25px', borderRadius: '30px', 
            border: 'none', fontSize: '1rem', outline: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' 
          }}
        />
      </div>

      <div className="container" style={{ padding: '3rem 24px' }}>
        
        {/* Categories */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap',
                border: activeCategory === cat ? 'none' : '1px solid #cbd5e1',
                background: activeCategory === cat ? '#0ea5e9' : 'white',
                color: activeCategory === cat ? 'white' : '#64748b',
                transition: 'all 0.2s'
              }}
            >
              {cat === 'Medicine' ? '💊' : cat === 'Vitamins' ? '🍋' : cat === 'First Aid' ? '🩹' : cat === 'Baby Care' ? '👶' : cat === 'Dental' ? '🦷' : ''} {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {filteredProducts.map(product => (
            <Link to={`/business/pharmacy/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                background: 'white', borderRadius: '15px', overflow: 'hidden', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'transform 0.2s', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', height: '100%'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{ height: '200px', background: `url(${product.image}) center/cover no-repeat` }} />
                  {product.requiresPrescription && (
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#ef4444', color: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      Rx Required
                    </div>
                  )}
                </div>
                
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.category}</span>
                  <h3 style={{ margin: '0.5rem 0', fontSize: '1.2rem', color: '#0f172a' }}>{product.name}</h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0ea5e9' }}>{product.price} ETB</div>
                    {product.stock ? (
                      <span style={{ color: '#16a34a', fontSize: '0.9rem', fontWeight: 'bold' }}>🟢 In Stock</span>
                    ) : (
                      <span style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 'bold' }}>🔴 Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <h2>No products found</h2>
            <p>Try adjusting your search or category filter.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default PharmacyShop;
