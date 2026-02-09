const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, unique: true, sparse: true },
  isEmailVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  balance: { type: Number, default: 0 },
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Generate referral code and hash password before save
UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password') && this.referralCode) return next();

    if (!this.referralCode) {
      // Generate unique referral code
      let code;
      do {
        code = Math.random().toString(36).substring(2, 8).toUpperCase();
      } while (await mongoose.model('User').findOne({ referralCode: code }));
      this.referralCode = code;
    }

    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
