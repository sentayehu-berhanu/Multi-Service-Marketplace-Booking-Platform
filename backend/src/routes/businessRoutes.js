const express = require('express');
const { createBusiness, getMyBusinesses, getAllBusinesses, getBusinessById, addService, updateService, deleteService, getBusinessCustomers, getCategories, getBusinessServices } = require('../controllers/businessController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const staffRoutes = require('./staffRoutes');
const availabilityRoutes = require('./availabilityRoutes');
const couponRoutes = require('./couponRoutes');
const galleryRoutes = require('./galleryRoutes');
const productRoutes = require('./productRoutes');

const router = express.Router();

// Public route to get all businesses (can be filtered by category via query params)
router.get('/', getAllBusinesses);

// Public route to get all categories
router.get('/categories', getCategories);

// Only BUSINESS_OWNER or ADMIN can register businesses and view their own dashboard
router.post('/', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), createBusiness);
router.get('/my', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), getMyBusinesses);

// Public route to get a single business by ID
router.get('/:id', getBusinessById);

router.post('/:id/services', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), upload.single('imageFile'), addService);
router.put('/:id/services/:serviceId', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), upload.single('imageFile'), updateService);
router.delete('/:id/services/:serviceId', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), deleteService);

// Customers route
router.get('/:id/customers', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), getBusinessCustomers);

// Public route to get services for a specific business
router.get('/:id/services', getBusinessServices);

// Nested routes for Staff, Availability, Coupons, Gallery
router.use('/:businessId/staff', staffRoutes);
router.use('/:businessId/hours', availabilityRoutes);
router.use('/:businessId/coupons', couponRoutes);
router.use('/:businessId/gallery', galleryRoutes);
router.use('/:businessId/products', productRoutes);

module.exports = router;
