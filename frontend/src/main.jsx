import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Global axios interceptor to handle expired or invalid tokens seamlessly
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg = error.response?.data?.error || '';
    if (error.response?.status === 401 || error.response?.status === 403 || errorMsg.includes('Invalid or expired token')) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        alert('Your session has expired or is invalid. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
