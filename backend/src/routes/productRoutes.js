const express = require('express');
const { addProduct, getProducts, updateProductStock, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router({ mergeParams: true });

// Public routes
router.get('/', getProducts);

// Protected routes for Business Owner
router.post('/', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), upload.single('imageFile'), addProduct);
router.patch('/:productId/stock', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), updateProductStock);
router.put('/:productId', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), upload.single('imageFile'), updateProduct);
router.delete('/:productId', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), deleteProduct);

module.exports = router;
