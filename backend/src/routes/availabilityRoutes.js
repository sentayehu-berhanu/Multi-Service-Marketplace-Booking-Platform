const express = require('express');
const { setBusinessHours, getBusinessHours } = require('../controllers/availabilityController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

// Public route to fetch hours
router.get('/', getBusinessHours);

// Protected routes to set hours
router.post('/', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), setBusinessHours);

module.exports = router;
