import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('CUSTOMER');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      alert('Registration successful, please log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.error || error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-panel">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create an Account</h2>
        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Password</label>
            <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" required style={{ paddingRight: '40px' }} />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              style={{ position: 'absolute', right: '10px', top: '35px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <div className="form-group">
            <label>Account Type</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="CUSTOMER">Customer</option>
              <option value="BUSINESS_OWNER">Business Owner</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
