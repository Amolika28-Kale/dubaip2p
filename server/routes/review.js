const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.get('/', reviewController.getAllReviews);
router.post('/', auth, reviewController.createReview);

module.exports = router;
