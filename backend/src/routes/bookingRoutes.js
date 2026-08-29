const express = require('express');
const { getAvailability, createBooking, getCustomerBookings, getBusinessBookings, updateBookingStatus } = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route to check availability
router.get('/availability', getAvailability);

// Customer routes
router.post('/', authenticate, authorize('CUSTOMER'), createBooking);
router.get('/my', authenticate, authorize('CUSTOMER'), getCustomerBookings);

// Business Owner routes
router.get('/business/:businessId', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), getBusinessBookings);
router.patch('/:id/status', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), updateBookingStatus);

module.exports = router;
