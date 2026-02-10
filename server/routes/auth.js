const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.post('/signup', authController.signup);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);
router.get('/me', auth, authController.getCurrentUser);
router.put('/me', auth, authController.updateProfile);
router.post('/resend-otp', authController.resendOtp);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);


// Admin routes
router.get('/admin/user/:userId', auth, adminOnly, authController.getUserById);
// 🔑 ADD THIS ROUTE:
router.get('/list', auth, adminOnly, authController.getAllUsers);
module.exports = router;
