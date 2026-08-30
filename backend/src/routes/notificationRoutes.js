const express = require('express');
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// All notification routes require authentication
router.use(authenticate);

router.get('/', getNotifications);
router.put('/mark-all-read', markAllAsRead);
router.put('/:id/read', markAsRead);

module.exports = router;
