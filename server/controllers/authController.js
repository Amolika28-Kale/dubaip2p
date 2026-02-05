const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';
const JWT_EXPIRE = '7d';

function generateToken(userId, email, username, isAdmin) {
  return jwt.sign({ userId, email, username, isAdmin }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
}

const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Email, password, and username required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ email, password, username, isAdmin: false });

    const token = generateToken(user._id, user.email, user.username, user.isAdmin);

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        balance: user.balance,
        referralCode: user.referralCode
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, password: password ? '***' : 'empty' });

    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.email, user.username, user.isAdmin);

    return res.json({ token, user: { id: user._id, email: user.email, username: user.username, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (password) user.password = password; // will be hashed in pre-save

    await user.save();
    const safe = {
      id: user._id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
      balance: user.balance,
      referralCode: user.referralCode
    };
    return res.json({ user: safe });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login, getCurrentUser, updateProfile };
