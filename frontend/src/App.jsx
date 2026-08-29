import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import BusinessPage from './pages/BusinessPage';
import BusinessDashboardLayout from './layouts/BusinessDashboardLayout';
import DashboardHome from './pages/business-dashboard/DashboardHome';

import './index.css';

import Login from './pages/Login';
import Register from './pages/Register';
import CustomerBookings from './pages/CustomerBookings';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="business/:id" element={<BusinessPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="my-bookings" element={<CustomerBookings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Business Dashboard Routes */}
        <Route path="/business-dashboard" element={<BusinessDashboardLayout />}>
          <Route index element={<DashboardHome />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
