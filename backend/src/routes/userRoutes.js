const express = require('express');
const { updateProfile } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/profile', authenticate, updateProfile);

module.exports = router;
