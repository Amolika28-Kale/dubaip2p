const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 3 },
  createdAt: { type: Date, default: Date.now }
});

// Index for automatic expiry
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for email lookup
OtpSchema.index({ email: 1 });

module.exports = mongoose.model('Otp', OtpSchema);
