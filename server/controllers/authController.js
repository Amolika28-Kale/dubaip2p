const User = require("../models/User");
const Otp = require("../models/Otp");
const { sendOTP } = require("../utils/emailService");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = "7d";

const generateToken = (user) => {
  if (typeof user === 'object' && user._id) {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );
  } else {
    // Fallback for old calls passing individual params
    const { userId, email, name, isAdmin } = user;
    return jwt.sign(
      {
        userId,
        email,
        name,
        isAdmin,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ $or: [{ email }, { phone }] });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    await User.create({
      name,
      email,
      phone,
      password,
      isEmailVerified: false,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      { upsert: true }
    );

    const result = await sendOTP(email, otp);

    if (!result.success) {
      return res.status(500).json({ message: "OTP send failed" });
    }

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Email not verified. Please verify your email first.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isAdmin: user.isAdmin,
        balance: user.balance,
        referralCode: user.referralCode
      }
    });
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
// Define the missing function
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// OTP verify flow
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email });
    if (!record) return res.status(400).json({ message: "OTP not found" });

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp) {
      record.attempts++;
      await record.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isEmailVerified = true;
    await user.save();

    await Otp.deleteOne({ email });

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        balance: user.balance,
        referralCode: user.referralCode,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      { upsert: true }
    );

    const result = await sendOTP(email, otp);
    if (!result.success) {
      return res.status(500).json({ message: "OTP send failed" });
    }

    res.json({ success: true, message: "OTP resent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.findOneAndUpdate(
    { email },
    { otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
    { upsert: true }
  );

  await sendOTP(email, otp);
  res.json({ success: true, message: "Password reset OTP sent" });
};
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const record = await Otp.findOne({ email });
  if (!record) return res.status(400).json({ message: "OTP not found" });

  if (record.expiresAt < new Date()) {
    await Otp.deleteOne({ email });
    return res.status(400).json({ message: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = newPassword;
  await user.save();

  await Otp.deleteOne({ email });

  res.json({ success: true, message: "Password reset successful" });
};



// Now this export line will work
module.exports = { signup, verifyOtp, login, getCurrentUser, updateProfile, getUserById, resendOtp, forgotPassword, resetPassword };

