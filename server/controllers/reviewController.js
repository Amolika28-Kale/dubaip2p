const Review = require('../models/Review');

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    return res.json({ reviews });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { text, rating } = req.body;
    if (!text) return res.status(400).json({ message: 'Review text required' });

    const review = await Review.create({
      userId: req.userId,
      username: req.username,
      text,
      rating: rating || 5
    });

    return res.json({ review });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
