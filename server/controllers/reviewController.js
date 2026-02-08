const Review = require('../models/Review');
const User = require('../models/User'); // ✅ import user model

exports.createReview = async (req, res) => {
  try {
    const { text, rating } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Review text required' });
    }

    // 🔑 fetch logged-in user
    const user = await User.findById(req.userId).select('name username email');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const review = await Review.create({
      userId: user._id,
      username: user.username || user.name || 'User',
      text,
      rating: rating || 5
    });

    return res.json({ review });
  } catch (err) {
    console.error('CREATE REVIEW ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
 exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.json({ reviews });
  } catch (err) {
    console.error('GET REVIEWS ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
