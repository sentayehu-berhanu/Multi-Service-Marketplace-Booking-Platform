const express = require('express');
const { initializePayment, paymentWebhook } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected route to start payment
router.post('/initialize', authenticate, initializePayment);

// Public webhook route (must be public so third-party can hit it)
router.post('/webhook', paymentWebhook);

module.exports = router;
