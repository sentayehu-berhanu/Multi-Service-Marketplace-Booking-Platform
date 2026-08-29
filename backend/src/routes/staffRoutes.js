const express = require('express');
const { addStaff, getStaffByBusiness } = require('../controllers/staffController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

// Public route to fetch staff
router.get('/', getStaffByBusiness);

// Protected routes
router.post('/', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), addStaff);

module.exports = router;
