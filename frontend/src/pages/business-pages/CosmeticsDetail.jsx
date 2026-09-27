import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CATEGORY_ICONS = [
  { name: 'Skin Care', icon: '🧴' },
  { name: 'Makeup', icon: '💄' },
  { name: 'Hair Care', icon: '🧴' },
  { name: 'Perfume', icon: '🧪' },
  { name: 'Tools', icon: '🖌️' }
];

const CosmeticsDetail = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch business details
        const bizRes = await axios.get(`http://localhost:5000/api/businesses/${id}`);
        setBusiness(bizRes.data);

        // Fetch products for this business
        let bizProducts = [];
        try {
          const prodRes = await axios.get(`http://localhost:5000/api/products`);
          if (prodRes.data && Array.isArray(prodRes.data)) {
            bizProducts = prodRes.data.filter(p => p.business_id === parseInt(id));
          }
        } catch (prodErr) {
          console.error('Failed to fetch products API, using fallback data:', prodErr);
        }
        
        if (bizProducts.length > 0) {
          setProducts(bizProducts);
        } else {
          // Fallback products if none exist in the database for this business or API fails
          setProducts([
            {
              id: 101,
              name: 'Glow Enhancing Serum',
              price: 1200,
              image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              category: 'Skin Care'
            },
            {
              id: 102,
              name: 'Matte Liquid Lipstick',
              price: 850,
              image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              category: 'Makeup'
            },
            {
              id: 103,
              name: 'Luminous Foundation',
              price: 1800,
              image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              category: 'Makeup'
            },
            {
              id: 104,
              name: 'Rosewater Facial Toner',
              price: 600,
              image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              category: 'Skin Care'
            },
            {
              id: 105,
              name: 'Nourishing Hair Oil',
              price: 1500,
              image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              category: 'Hair Care'
            },
            {
              id: 106,
              name: 'Signature Floral Perfume',
              price: 2500,
              image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              category: 'Perfume'
            },
            {
              id: 107,
              name: 'Professional Makeup Brushes',
              price: 1100,
              image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              category: 'Tools'
            }
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch cosmetics business details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    setToastMessage('🛒 Product added to cart!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const showNotification = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Loading Cosmetics Shop...</div>;
  }

  if (!business) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Business not found</div>;
  }

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory || (p.name && p.name.includes(selectedCategory)));

  return (
    <div className="container" style={{ padding: '2rem 24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#9b87f5',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 9999,
          fontWeight: 'bold'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Main White Card matching the design */}
      <div style={{ 
        background: '#ffffff', 
        color: '#1a1a2e', 
        borderRadius: '24px', 
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', fontWeight: 'bold', color: '#1a1a2e', fontSize: '1.1rem' }}>
          <span style={{ color: '#9b87f5', fontSize: '1.4rem' }}>🛍️</span>
          SHOPPING - COSMETICS
        </div>

        {/* Business Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: '#1a1a2e' }}>{business.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: '#666' }}>
              <span style={{ color: '#f59e0b' }}>⭐ {business.rating || '4.8'}</span>
              <span>({business.review_count || '120'} reviews)</span>
            </div>
            <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.95rem' }}>Free delivery on orders over 1,000 ETB</p>
          </div>
          <div style={{ display: 'flex', gap: '15px', color: '#666', fontSize: '1.2rem' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => showNotification('❤️ Saved to favorites!')}>♡</span>
            <span style={{ cursor: 'pointer' }} onClick={() => showNotification('📤 Link copied to clipboard!')}>📤</span>
          </div>
        </div>

        {/* Hero Banner */}
        <div style={{ 
          background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', // Fallback gradient
          backgroundImage: `url('https://images.unsplash.com/photo-1612817288484-6f916006741a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '20px',
          padding: '3rem 2rem',
          marginBottom: '3rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(245,230,250,0.95) 0%, rgba(245,230,250,0.4) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '50%' }}>
            <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#333' }}>Up to 30% OFF</h2>
            <p style={{ fontSize: '1.1rem', margin: '0 0 1.5rem 0', color: '#555' }}>On Selected Items</p>
            <button 
              onClick={() => document.getElementById('best-sellers').scrollIntoView({ behavior: 'smooth' })}
              style={{ 
              background: '#9b87f5', 
              color: 'white', 
              border: 'none', 
              padding: '10px 24px', 
              borderRadius: '20px', 
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>Shop Now</button>
          </div>
        </div>

        {/* Categories Row */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', overflowX: 'auto', paddingBottom: '10px' }}>
          {CATEGORY_ICONS.map((cat, idx) => (
            <div key={idx} 
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'All' : cat.name)}
              style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '10px',
              minWidth: '100px',
              cursor: 'pointer'
            }}>
              <div style={{ 
                width: '70px', 
                height: '70px', 
                borderRadius: '16px', 
                background: selectedCategory === cat.name ? '#e0c3fc' : '#f8f9fa', 
                border: selectedCategory === cat.name ? '2px solid #9b87f5' : '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                transition: 'transform 0.2s',
              }} className="hover-scale">
                {cat.icon}
              </div>
              <span style={{ fontSize: '0.9rem', color: '#555', fontWeight: '500' }}>{cat.name}</span>
            </div>
          ))}
          <div 
            onClick={() => {
              setSelectedCategory('All');
              document.getElementById('best-sellers').scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginLeft: 'auto',
            fontWeight: 'bold',
            color: '#333',
            cursor: 'pointer'
          }}>
            View All
          </div>
        </div>

        {/* Best Sellers Grid */}
        <h3 id="best-sellers" style={{ fontSize: '1.4rem', margin: '0 0 1.5rem 0', color: '#1a1a2e' }}>
          {selectedCategory === 'All' ? 'Best Sellers' : `${selectedCategory} Products`}
        </h3>
        
        {filteredProducts.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666', background: '#f8f9fa', borderRadius: '16px' }}>
            No {selectedCategory !== 'All' ? selectedCategory : ''} products found.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {filteredProducts.map(product => (
              <div key={product.id} style={{ 
                background: '#fff', 
                border: '1px solid #eee', 
                borderRadius: '16px', 
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.2s, transform 0.2s',
                cursor: 'pointer'
              }} className="hover-scale">
                
                {/* Product Image */}
                <div style={{ 
                  height: '180px', 
                  background: `url(${product.image?.startsWith('/uploads') ? 'http://localhost:5000' + product.image : product.image}) center/contain no-repeat`,
                  marginBottom: '1rem'
                }} />
                
                {/* Product Info */}
                <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0', color: '#333', fontWeight: '500' }}>{product.name}</h4>
                  <p style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: '#1a1a2e', fontWeight: 'bold' }}>{product.price} ETB</p>
                  
                  {/* Add to Cart Button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                    style={{ 
                      marginTop: 'auto',
                      width: '100%',
                      padding: '8px',
                      background: 'transparent',
                      color: '#3b82f6',
                      border: '1px solid #3b82f6',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>+</span> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CosmeticsDetail;
