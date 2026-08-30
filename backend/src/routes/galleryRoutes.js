const express = require('express');
const { uploadImage, getGallery, deleteImage } = require('../controllers/galleryController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Mounted at /api/businesses/:businessId/gallery
const router = express.Router({ mergeParams: true });

// Public route to view gallery
router.get('/', getGallery);

// Protected routes to manage gallery
router.post('/', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), upload.single('imageFile'), uploadImage);
router.delete('/:imageId', authenticate, authorize('BUSINESS_OWNER', 'ADMIN'), deleteImage);

module.exports = router;
