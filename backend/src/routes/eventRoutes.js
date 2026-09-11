const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route to get events
router.get('/', eventController.getEventsByBusiness);

// Protected routes
router.post('/business/:businessId', authenticate, upload.single('imageFile'), eventController.addEvent);
router.delete('/business/:businessId/:eventId', authenticate, eventController.deleteEvent);

module.exports = router;
