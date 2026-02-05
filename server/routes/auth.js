const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', auth, authController.getCurrentUser);
router.put('/me', auth, authController.updateProfile);

// Admin routes
router.get('/admin/user/:userId', auth, adminOnly, authController.getUserById);

module.exports = router;
