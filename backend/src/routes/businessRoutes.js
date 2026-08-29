const express = require('express');
const { createBusiness, getMyBusinesses, addService } = require('../controllers/businessController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const staffRoutes = require('./staffRoutes');
const availabilityRoutes = require('./availabilityRoutes');

const router = express.Router();

// Only BUSINESS_OWNER or ADMIN can register businesses and view their own dashboard
router.post('/', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), createBusiness);
router.get('/my', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), getMyBusinesses);
router.post('/:id/services', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), addService);

// Nested routes for Staff and Availability
router.use('/:businessId/staff', staffRoutes);
router.use('/:businessId/hours', availabilityRoutes);

module.exports = router;
