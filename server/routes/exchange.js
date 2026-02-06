const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const tradeController = require('../controllers/tradeController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const name = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

router.post('/initiate', auth, tradeController.initiateExchange);
router.get('/trade/:tradeId', tradeController.getTrade);
router.post('/confirm-payment', auth, upload.single('screenshot'), tradeController.confirmPayment);

// User-specific
router.get('/my', auth, tradeController.myTrades);

// Payment Details
router.get('/payment-details', tradeController.getPaymentDetails);
router.post('/admin/payment-details', auth, adminOnly, tradeController.setPaymentDetails);

// Admin routes (JWT + isAdmin check)
router.get('/admin/list', auth, adminOnly, tradeController.adminList);
router.post('/admin/release', auth, adminOnly, tradeController.releaseAssets);
router.post('/admin/rate', auth, adminOnly, tradeController.setRate);

// Admin reject
router.post('/admin/reject', auth, adminOnly, tradeController.rejectTrade);

// routes/exchange.js

// 1. PUBLIC: Anyone can see if you are online (Used by Badge)
router.get('/operator', tradeController.getOperatorStatus); 

// 2. PRIVATE: Only Admin can toggle status (Used by AdminDashboard)
router.post('/admin/operator', auth, adminOnly, tradeController.setOperatorStatus);

// Public endpoints
router.get('/rate', tradeController.getRate);
router.get('/latest', tradeController.latest);
router.get('/reserves', tradeController.getReserves);
// Admin stats
router.get('/admin/stats', auth, adminOnly, tradeController.adminStats);
router.post('/reserves', auth, adminOnly, tradeController.setReserves);

module.exports = router;
