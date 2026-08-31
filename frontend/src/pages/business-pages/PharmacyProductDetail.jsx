import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PharmacyProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);

  // Mocking the data for the requested ID
  const MOCK_DB = {
    '101': { id: 101, name: 'Vitamin C 1000mg', category: 'Vitamins', price: 250, stock: true, requiresPrescription: false, description: 'Boost your immune system with high-potency Vitamin C. Recommended for daily use to prevent colds and maintain health.', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    '102': { id: 102, name: 'Amoxicillin 500mg', category: 'Medicine', price: 150, stock: true, requiresPrescription: true, description: 'Antibiotic used to treat a number of bacterial infections. Must be taken exactly as prescribed by your doctor.', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
  };

  const product = MOCK_DB[id] || MOCK_DB['101'];

  const handleAddToCart = () => {
    // Jump straight to the specialized checkout flow for this item
    navigate('/checkout/pharmacy', {
      state: {
        product: product,
        quantity: quantity,
        totalPrice: product.price * quantity
      }
    });
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ background: '#0284c7', padding: '2rem 24px', color: 'white' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Pharmacy / {product.category} / {product.name}</span>
        </div>
      </div>

      <div className="container" style={{ padding: '4rem 24px', maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
        
        {/* Left Col: Image */}
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '10px' }} />
          </div>
        </div>

        {/* Right Col: Details */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            {product.requiresPrescription && (
              <span style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', padding: '5px 10px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', display: 'inline-block', marginBottom: '1rem' }}>
                ⚠️ Prescription Required
              </span>
            )}
            <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0', color: '#0f172a' }}>{product.name}</h1>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0ea5e9', marginBottom: '1rem' }}>
              {product.price} ETB
            </div>
            
            <div style={{ display: 'inline-block', background: product.stock ? '#dcfce7' : '#fee2e2', color: product.stock ? '#166534' : '#991b1b', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' }}>
              {product.stock ? '🟢 In Stock' : '🔴 Out of Stock'}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.5rem' }}>Description</h3>
            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6 }}>{product.description}</p>
          </div>

          <div style={{ marginTop: 'auto', background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: 'bold', color: '#64748b' }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ border: 'none', background: 'transparent', padding: '10px 15px', fontSize: '1.2rem', cursor: 'pointer' }}>-</button>
                <div style={{ padding: '10px 15px', fontWeight: 'bold', fontSize: '1.2rem', minWidth: '40px', textAlign: 'center' }}>{quantity}</div>
                <button onClick={() => setQuantity(quantity + 1)} style={{ border: 'none', background: 'transparent', padding: '10px 15px', fontSize: '1.2rem', cursor: 'pointer' }}>+</button>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={!product.stock}
              style={{ 
                width: '100%', padding: '15px', background: product.stock ? '#0ea5e9' : '#cbd5e1', 
                color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.2rem', fontWeight: 'bold', 
                cursor: product.stock ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
                boxShadow: product.stock ? '0 4px 6px -1px rgba(14, 165, 233, 0.5)' : 'none'
              }}
            >
              {product.stock ? 'Add to Cart & Checkout' : 'Out of Stock'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PharmacyProductDetail;
