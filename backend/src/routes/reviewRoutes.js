const express = require('express');
const { createReview, getBusinessReviews } = require('../controllers/reviewController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route to view reviews
router.get('/business/:businessId', getBusinessReviews);

// Protected route to leave a review
router.post('/', authenticate, createReview);

module.exports = router;
