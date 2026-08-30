const express = require('express');
const { createBusiness, getMyBusinesses, getAllBusinesses, addService, updateService, deleteService, getBusinessCustomers } = require('../controllers/businessController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const staffRoutes = require('./staffRoutes');
const availabilityRoutes = require('./availabilityRoutes');
const couponRoutes = require('./couponRoutes');
const galleryRoutes = require('./galleryRoutes');

const router = express.Router();

// Public route to get all businesses (can be filtered by category via query params)
router.get('/', getAllBusinesses);

// Only BUSINESS_OWNER or ADMIN can register businesses and view their own dashboard
router.post('/', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), createBusiness);
router.get('/my', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), getMyBusinesses);
router.post('/:id/services', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), upload.single('imageFile'), addService);
router.put('/:id/services/:serviceId', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), upload.single('imageFile'), updateService);
router.delete('/:id/services/:serviceId', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), deleteService);

// Customers route
router.get('/:id/customers', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), getBusinessCustomers);

// Nested routes for Staff, Availability, Coupons, Gallery
router.use('/:businessId/staff', staffRoutes);
router.use('/:businessId/hours', availabilityRoutes);
router.use('/:businessId/coupons', couponRoutes);
router.use('/:businessId/gallery', galleryRoutes);

module.exports = router;
