const express = require('express');
const { addProduct, getProducts, updateProductStock } = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

// Public routes
router.get('/', getProducts);

// Protected routes for Business Owner
router.post('/', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), addProduct);
router.patch('/:productId/stock', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), updateProductStock);

module.exports = router;
