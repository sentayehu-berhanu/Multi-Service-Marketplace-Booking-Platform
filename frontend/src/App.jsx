import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import BusinessPage from './pages/BusinessPage';
import CosmeticsShop from './pages/shop/CosmeticsShop';
import BarberShop from './pages/shop/BarberShop';
import BarberDetail from './pages/business-pages/BarberDetail';
import WomensSalonPage from './pages/business-pages/WomensSalonPage';
import ParkingShop from './pages/shop/ParkingShop';
import ParkingDetail from './pages/business-pages/ParkingDetail';
import ParkingConfirmation from './pages/booking/ParkingConfirmation';
import PharmacyShop from './pages/shop/PharmacyShop';
import PharmacyProductDetail from './pages/business-pages/PharmacyProductDetail';
import PharmacyCheckoutFlow from './pages/booking/PharmacyCheckoutFlow';
import CafeDetail from './pages/business-pages/CafeDetail';
import CafeConfirmation from './pages/booking/CafeConfirmation';
import HotelSearch from './pages/shop/HotelSearch';
import HotelDetail from './pages/business-pages/HotelDetail';
import HotelBookingFlow from './pages/booking/HotelBookingFlow';
import RestaurantSearch from './pages/shop/RestaurantSearch';
import RestaurantDetail from './pages/business-pages/RestaurantDetail';
import RestaurantCheckoutFlow from './pages/booking/RestaurantCheckoutFlow';
import AutoServiceSearch from './pages/shop/AutoServiceSearch';
import AutoServiceDetail from './pages/business-pages/AutoServiceDetail';
import AutoCheckoutFlow from './pages/booking/AutoCheckoutFlow';
import BookingFlow from './pages/booking/BookingFlow';
import CleaningSearch from './pages/shop/CleaningSearch';
import CleaningCheckoutFlow from './pages/booking/CleaningCheckoutFlow';
import BusinessDashboardLayout from './layouts/BusinessDashboardLayout';
import DashboardHome from './pages/business-dashboard/DashboardHome';
import DashboardCalendar from './pages/business-dashboard/DashboardCalendar';
import DashboardServices from './pages/business-dashboard/DashboardServices';
import DashboardSalonServices from './pages/business-dashboard/DashboardSalonServices';
import DashboardParkingSpaces from './pages/business-dashboard/DashboardParkingSpaces';
import DashboardProducts from './pages/business-dashboard/DashboardProducts';
import DashboardPharmacyProducts from './pages/business-dashboard/DashboardPharmacyProducts';
import DashboardCafeMenu from './pages/business-dashboard/DashboardCafeMenu';
import DashboardCafeTables from './pages/business-dashboard/DashboardCafeTables';
import DashboardHotelRooms from './pages/business-dashboard/DashboardHotelRooms';
import DashboardAutoServices from './pages/business-dashboard/DashboardAutoServices';
import DashboardCustomers from './pages/business-dashboard/DashboardCustomers';
import DashboardReviews from './pages/business-dashboard/DashboardReviews';
import DashboardCleaningServices from './pages/business-dashboard/DashboardCleaningServices';
import DashboardRepairJobs from './pages/business-dashboard/DashboardRepairJobs';
import DashboardRepairServices from './pages/business-dashboard/DashboardRepairServices';
import HomeRepair from './pages/shop/HomeRepair';
import GymSearch from './pages/shop/GymSearch';
import GymDetail from './pages/business-pages/GymDetail';
import GymCheckoutFlow from './pages/booking/GymCheckoutFlow';
import DashboardGymServices from './pages/business-dashboard/DashboardGymServices';
import DashboardHealthcareServices from './pages/business-dashboard/DashboardHealthcareServices';
import DashboardTutorServices from './pages/business-dashboard/DashboardTutorServices';
import DashboardSpaServices from './pages/business-dashboard/DashboardSpaServices';
import DashboardTransportationServices from './pages/business-dashboard/DashboardTransportationServices';
import DashboardDeliveryOrders from './pages/business-dashboard/DashboardDeliveryOrders';
import DashboardDeliveryProducts from './pages/business-dashboard/DashboardDeliveryProducts';
import DashboardEventsManagement from './pages/business-dashboard/DashboardEventsManagement';
import HealthcareSearch from './pages/shop/HealthcareSearch';
import HealthcareDoctorDetail from './pages/business-pages/HealthcareDoctorDetail';
import SpaBooking from './pages/shop/SpaBooking';
import Transportation from './pages/transportation/Transportation';

import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import AdminBusinesses from './pages/admin-dashboard/AdminBusinesses';
import AdminCreateBusiness from './pages/admin-dashboard/AdminCreateBusiness';
import './index.css';

import Login from './pages/Login';
import Register from './pages/Register';
import CustomerBookings from './pages/CustomerBookings';
import Profile from './pages/Profile';
import TutorTraining from './pages/tutor-training/TutorTraining';
import LocalDelivery from './pages/delivery/LocalDelivery';
import Events from './pages/events/Events';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="category/:categoryName" element={<CategoryPage />} />
          <Route path="shop/hotel" element={<HotelSearch />} />
          <Route path="shop/cosmetics" element={<CosmeticsShop />} />
          <Route path="shop/barber" element={<BarberShop />} />
          <Route path="shop/parking" element={<ParkingShop />} />
          <Route path="shop/pharmacy" element={<PharmacyShop />} />
          <Route path="shop/transportation" element={<Transportation />} />
          <Route path="business/barber/:id" element={<BarberDetail />} />
          <Route path="business/salon/:id" element={<WomensSalonPage />} />
          <Route path="business/parking/:id" element={<ParkingDetail />} />
          <Route path="business/cafe/:id" element={<CafeDetail />} />
          <Route path="business/hotel/:id" element={<HotelDetail />} />
          <Route path="shop/restaurant" element={<RestaurantSearch />} />
          <Route path="business/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="checkout/restaurant" element={<RestaurantCheckoutFlow />} />
          <Route path="shop/auto" element={<AutoServiceSearch />} />
          <Route path="shop/cleaning" element={<CleaningSearch />} />
          <Route path="checkout/cleaning" element={<CleaningCheckoutFlow />} />
          <Route path="shop/repair" element={<HomeRepair />} />
          <Route path="shop/healthcare" element={<HealthcareSearch />} />
          <Route path="shop/spa" element={<SpaBooking />} />
          <Route path="business/doctor/:id" element={<HealthcareDoctorDetail />} />
          <Route path="shop/gym" element={<GymSearch />} />
          <Route path="business/gym/:id" element={<GymDetail />} />
          <Route path="checkout/gym" element={<GymCheckoutFlow />} />
          <Route path="business/auto/:id" element={<AutoServiceDetail />} />
          <Route path="checkout/auto" element={<AutoCheckoutFlow />} />
          <Route path="business/pharmacy/product/:id" element={<PharmacyProductDetail />} />
          <Route path="book/:businessId" element={<BookingFlow />} />
          <Route path="booking/parking/success" element={<ParkingConfirmation />} />
          <Route path="booking/cafe/success" element={<CafeConfirmation />} />
          <Route path="checkout/pharmacy" element={<PharmacyCheckoutFlow />} />
          <Route path="checkout/hotel" element={<HotelBookingFlow />} />
          <Route path="business/:id" element={<BusinessPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="my-bookings" element={<CustomerBookings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="shop/tutors" element={<TutorTraining />} />
          <Route path="delivery" element={<LocalDelivery />} />
          <Route path="events" element={<Events />} />
        </Route>

        {/* Business Dashboard Routes */}
        <Route path="/business-dashboard" element={<BusinessDashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="calendar" element={<DashboardCalendar />} />
          <Route path="services" element={<DashboardServices />} />
          <Route path="salon-services" element={<DashboardSalonServices />} />
          <Route path="parking-spaces" element={<DashboardParkingSpaces />} />
          <Route path="products" element={<DashboardProducts />} />
          <Route path="pharmacy-products" element={<DashboardPharmacyProducts />} />
          <Route path="cafe-menu" element={<DashboardCafeMenu />} />
          <Route path="cafe-tables" element={<DashboardCafeTables />} />
          <Route path="hotel-rooms" element={<DashboardHotelRooms />} />
          <Route path="auto-services" element={<DashboardAutoServices />} />
          <Route path="cleaning-services" element={<DashboardCleaningServices />} />
          <Route path="repair-services" element={<DashboardRepairServices />} />
          <Route path="gym-services" element={<DashboardGymServices />} />
          <Route path="healthcare-services" element={<DashboardHealthcareServices />} />
          <Route path="spa-services" element={<DashboardSpaServices />} />
          <Route path="tutor-programs" element={<DashboardTutorServices />} />
          <Route path="transportation-services" element={<DashboardTransportationServices />} />
          <Route path="delivery-orders" element={<DashboardDeliveryOrders />} />
          <Route path="delivery-products" element={<DashboardDeliveryProducts />} />
          <Route path="events-management" element={<DashboardEventsManagement />} />
          <Route path="repair-jobs" element={<DashboardRepairJobs />} />
          <Route path="customers" element={<DashboardCustomers />} />
          <Route path="reviews" element={<DashboardReviews />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<AdminBusinesses />} />
          <Route path="create-business" element={<AdminCreateBusiness />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
