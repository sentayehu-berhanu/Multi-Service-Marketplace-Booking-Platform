const axios = require('axios');

async function test() {
  try {
    // 1. Register a test user
    const email = `testuser_${Date.now()}@example.com`;
    await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: email,
      password: 'password123',
      role: 'CUSTOMER'
    });

    // 2. Login
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: email,
      password: 'password123'
    });
    const token = loginRes.data.token;

    // 3. Fetch businesses
    const bizRes = await axios.get('http://localhost:5000/api/businesses?category=home-repair');
    const provider = bizRes.data[0];
    if (!provider) {
      console.log('No provider found');
      return;
    }
    
    // 4. Find service
    let service = provider.services?.[0];
    if (!service) {
      console.log('No service found for provider');
      return;
    }

    // 5. Make booking request
    const start_time = new Date(`2026-09-12T05:07`).toISOString();
    console.log("Sending:", { business_id: provider.id, service_id: service.id, start_time });
    
    const res = await axios.post('http://localhost:5000/api/bookings', {
      business_id: provider.id,
      service_id: service.id,
      start_time: start_time
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Success:', res.data);
  } catch(e) {
    console.error('Error:', e.response ? e.response.data : e.message);
  }
}
test();
