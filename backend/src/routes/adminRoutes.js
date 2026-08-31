const express = require('express');
const { createBusinessWithOwner, getAllBusinessesAdmin } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes in this file are protected and require ADMIN role
router.use(authenticate);
router.use(authorize('ADMIN'));

router.post('/businesses', createBusinessWithOwner);
router.get('/businesses', getAllBusinessesAdmin);

module.exports = router;
