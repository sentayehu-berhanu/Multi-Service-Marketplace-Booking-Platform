const express = require('express');
const { createOrder, updateOrderStatus, getCustomerOrders, getBusinessOrders } = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Customer routes
router.post('/', authenticate, authorize('CUSTOMER'), createOrder);
router.get('/my', authenticate, authorize('CUSTOMER'), getCustomerOrders);

// Business Owner routes
router.get('/business/:businessId', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), getBusinessOrders);
router.patch('/:orderId/status', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), updateOrderStatus);

module.exports = router;
