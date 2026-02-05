const mongoose = require('mongoose');

const PaymentDetailSchema = new mongoose.Schema({
  method: { type: String, required: true }, // UPI, BANK
  details: {
    // For UPI: { upiId, name, phone }
    // For BANK: { accountName, accountNumber, ifsc, bankName }
  },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PaymentDetail', PaymentDetailSchema);
