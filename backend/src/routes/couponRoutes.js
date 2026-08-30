const express = require('express');
const { createCoupon, getBusinessCoupons } = require('../controllers/couponController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Note: Mounted at /api/businesses/:businessId/coupons
const router = express.Router({ mergeParams: true });

router.get('/', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), getBusinessCoupons);
router.post('/', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), createCoupon);

module.exports = router;
