async function test() {
  try {
    // 1. Register a test user
    const email = `testuser_${Date.now()}@example.com`;
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: email,
        password: 'password123',
        role: 'CUSTOMER'
      })
    });
    if (!regRes.ok) throw new Error(await regRes.text());

    // 2. Login
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: 'password123'
      })
    });
    if (!loginRes.ok) throw new Error(await loginRes.text());
    const loginData = await loginRes.json();
    const token = loginData.tokens.accessToken;

    // 3. Fetch businesses
    const bizRes = await fetch('http://localhost:5000/api/businesses?category=home-repair');
    if (!bizRes.ok) throw new Error(await bizRes.text());
    const bizData = await bizRes.json();
    const provider = bizData[0];
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
    
    const res = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        business_id: provider.id,
        service_id: service.id,
        start_time: start_time
      })
    });

    if (!res.ok) {
      console.error('Error:', await res.text());
    } else {
      console.log('Success:', await res.json());
    }
  } catch(e) {
    console.error('Exception:', e.message);
  }
}
test();
