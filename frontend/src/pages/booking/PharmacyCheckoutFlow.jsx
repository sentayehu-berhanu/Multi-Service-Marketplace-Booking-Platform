import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const STEPS = [
  'Cart',
  'Delivery Method',
  'Address',
  'Prescription',
  'Payment',
  'Success'
];

const PharmacyCheckoutFlow = () => {
  const location = useLocation();
  const state = location.state;

  if (!state || !state.product) {
    return <Navigate to="/shop/pharmacy" />;
  }

  const { product, quantity, totalPrice } = state;

  const [currentStep, setCurrentStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState('Delivery'); // Delivery or Pickup
  const [address, setAddress] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [orderRef] = useState(`#RX${Math.floor(10000 + Math.random() * 90000)}`);

  const nextStep = () => {
    // Logic to skip address if Pickup
    if (currentStep === 1 && deliveryMethod === 'Store Pickup') {
      // If prescription required, go to Prescription (step 3), else skip to Payment (step 4)
      setCurrentStep(product.requiresPrescription ? 3 : 4);
      return;
    }

    // Logic to skip prescription if not required
    if (currentStep === 2 && !product.requiresPrescription) {
      setCurrentStep(4); // Skip to Payment
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep === 3 && deliveryMethod === 'Store Pickup') {
      setCurrentStep(1); // Go back to Delivery Method
      return;
    }
    if (currentStep === 4 && !product.requiresPrescription) {
      setCurrentStep(deliveryMethod === 'Store Pickup' ? 1 : 2);
      return;
    }
    setCurrentStep(currentStep - 1);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ background: 'white', padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Pharmacy Checkout</h1>
          <Link to={`/business/pharmacy/product/${product.id}`} style={{ color: '#64748b', textDecoration: 'none' }}>Cancel Order</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ padding: '3rem 24px', maxWidth: '800px', margin: '0 auto', flex: 1 }}>
        
        {/* Progress Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '15px', left: 0, right: 0, height: '4px', background: '#e2e8f0', zIndex: 0 }}>
            <div style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%`, height: '100%', background: '#0ea5e9', transition: 'width 0.3s' }}></div>
          </div>
          {STEPS.map((step, index) => {
            // Hide steps dynamically based on flow logic (purely visual for progress bar)
            if (step === 'Address' && deliveryMethod === 'Store Pickup') return null;
            if (step === 'Prescription' && !product.requiresPrescription) return null;
            
            const isActive = index <= currentStep;
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                <div style={{ 
                  width: '34px', height: '34px', borderRadius: '50%', 
                  background: isActive ? '#0ea5e9' : 'white', 
                  border: isActive ? '2px solid #0ea5e9' : '2px solid #cbd5e1',
                  color: isActive ? 'white' : '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                  marginBottom: '10px', transition: 'all 0.3s'
                }}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: isActive ? '#0f172a' : '#94a3b8', textAlign: 'center' }}>{step}</span>
              </div>
            );
          })}
        </div>

        {/* Step Container */}
        <div style={{ background: 'white', padding: '3rem', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
          
          {currentStep === 0 && (
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Review Cart</h2>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '15px' }}>
                <img src={product.image} alt={product.name} style={{ width: '100px', borderRadius: '10px' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{product.name}</h3>
                  <div style={{ color: '#64748b' }}>Qty: {quantity}</div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0ea5e9' }}>{totalPrice} ETB</div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Delivery Method</h2>
              <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                <div 
                  onClick={() => setDeliveryMethod('Delivery')}
                  style={{ 
                    padding: '1.5rem', border: deliveryMethod === 'Delivery' ? '2px solid #0ea5e9' : '2px solid #e2e8f0', 
                    borderRadius: '15px', cursor: 'pointer', background: deliveryMethod === 'Delivery' ? '#f0f9ff' : 'white',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a' }}>🛵 Home Delivery</div>
                    <div style={{ color: '#64748b', marginTop: '5px' }}>Delivered to your door within 2-4 hours.</div>
                  </div>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {deliveryMethod === 'Delivery' && <div style={{ width: '12px', height: '12px', background: '#0ea5e9', borderRadius: '50%' }}></div>}
                  </div>
                </div>

                <div 
                  onClick={() => setDeliveryMethod('Store Pickup')}
                  style={{ 
                    padding: '1.5rem', border: deliveryMethod === 'Store Pickup' ? '2px solid #0ea5e9' : '2px solid #e2e8f0', 
                    borderRadius: '15px', cursor: 'pointer', background: deliveryMethod === 'Store Pickup' ? '#f0f9ff' : 'white',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a' }}>🏪 Store Pickup</div>
                    <div style={{ color: '#64748b', marginTop: '5px' }}>Collect from the pharmacy directly. Free.</div>
                  </div>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {deliveryMethod === 'Store Pickup' && <div style={{ width: '12px', height: '12px', background: '#0ea5e9', borderRadius: '50%' }}></div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Delivery Address</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ fontWeight: 'bold', color: '#64748b' }}>Full Address</label>
                <textarea 
                  rows="4"
                  placeholder="Enter your street, house number, and neighborhood..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ padding: '15px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Prescription Verification</h2>
              <p style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '2rem' }}>⚠️ This medication requires a valid prescription.</p>
              
              <div style={{ 
                border: '2px dashed #94a3b8', borderRadius: '15px', padding: '3rem', textAlign: 'center',
                background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
              }}>
                <span style={{ fontSize: '3rem' }}>📄</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a' }}>Upload Prescription</div>
                <div style={{ color: '#64748b' }}>Please upload a clear photo or PDF of your doctor's prescription.</div>
                
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={(e) => setPrescriptionFile(e.target.files[0])}
                  style={{ marginTop: '1rem' }}
                />
                
                {prescriptionFile && (
                  <div style={{ background: '#dcfce7', color: '#166534', padding: '10px 20px', borderRadius: '10px', marginTop: '1rem', fontWeight: 'bold' }}>
                    ✓ File attached: {prescriptionFile.name}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Payment Method</h2>
              <select 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1.1rem', outline: 'none', marginBottom: '1rem' }}
              >
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Telebirr">Telebirr Mobile Money</option>
                <option value="CBE Birr">CBE Birr</option>
                <option value="Card">Credit/Debit Card</option>
              </select>

              {paymentMethod === 'Telebirr' && (
                <div style={{ marginBottom: '2rem', animation: 'fadeIn 0.3s ease' }}>
                  <input type="tel" placeholder="09XX XXX XXX" style={{ width: '100%', boxSizing: 'border-box', padding: '15px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
              )}
              {paymentMethod === 'CBE Birr' && (
                <div style={{ marginBottom: '2rem', animation: 'fadeIn 0.3s ease' }}>
                  <input type="tel" placeholder="1000XXXXXXXXX" style={{ width: '100%', boxSizing: 'border-box', padding: '15px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
              )}

              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#64748b' }}>Subtotal</span>
                  <span style={{ fontWeight: 'bold' }}>{totalPrice} ETB</span>
                </div>
                {deliveryMethod === 'Delivery' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: '#64748b' }}>Delivery Fee</span>
                    <span style={{ fontWeight: 'bold' }}>50 ETB</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #cbd5e1', fontSize: '1.2rem' }}>
                  <span style={{ fontWeight: 'bold' }}>Total</span>
                  <span style={{ fontWeight: 'bold', color: '#0ea5e9' }}>{deliveryMethod === 'Delivery' ? totalPrice + 50 : totalPrice} ETB</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 1.5rem' }}>
                ✓
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Order Received!</h2>
              <div style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '2rem' }}>Order Reference: <strong style={{ color: '#0f172a' }}>{orderRef}</strong></div>
              
              <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '15px', textAlign: 'left', marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1.5rem 0' }}>Order Status Timeline</h3>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '1.5rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#10b981', border: '4px solid #d1fae5', flexShrink: 0 }}></div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>Order Placed</div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>We have received your order.</div>
                  </div>
                </div>

                {product.requiresPrescription && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '1.5rem' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#f59e0b', border: '4px solid #fef3c7', flexShrink: 0 }}></div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#0f172a' }}>Verifying Prescription</div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Our pharmacist is reviewing your attached prescription.</div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', opacity: 0.5 }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#cbd5e1', flexShrink: 0 }}></div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{deliveryMethod === 'Delivery' ? 'Out for Delivery' : 'Ready for Pickup'}</div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>You will be notified when it's ready.</div>
                  </div>
                </div>

              </div>

              <Link to="/shop/pharmacy">
                <button style={{ padding: '15px 30px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  Continue Shopping
                </button>
              </Link>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
              <button 
                onClick={prevStep}
                disabled={currentStep === 0}
                style={{ 
                  padding: '12px 25px', background: 'transparent', color: currentStep === 0 ? '#cbd5e1' : '#64748b', 
                  border: '1px solid', borderColor: currentStep === 0 ? '#e2e8f0' : '#cbd5e1', 
                  borderRadius: '8px', fontWeight: 'bold', cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Back
              </button>
              <button 
                onClick={nextStep}
                disabled={currentStep === 3 && product.requiresPrescription && !prescriptionFile}
                style={{ 
                  padding: '12px 25px', background: (currentStep === 3 && product.requiresPrescription && !prescriptionFile) ? '#cbd5e1' : '#0ea5e9', 
                  color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', 
                  cursor: (currentStep === 3 && product.requiresPrescription && !prescriptionFile) ? 'not-allowed' : 'pointer'
                }}
              >
                {currentStep === 4 ? 'Confirm Order' : 'Continue'}
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default PharmacyCheckoutFlow;
