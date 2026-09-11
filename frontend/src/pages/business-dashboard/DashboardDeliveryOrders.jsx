import React from 'react';

const DashboardDeliveryOrders = () => {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Delivery Orders</h1>
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <h3>Manage your local delivery orders here.</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
          This section is currently under development. Soon you will be able to track drivers, view incoming orders, and manage inventory.
        </p>
      </div>
    </div>
  );
};

export default DashboardDeliveryOrders;
