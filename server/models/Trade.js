const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
  userId: { type: String, required: false },

  sendMethod: { type: String, required: true },
  receiveMethod: { type: String, required: true },

  fiatAmount: { type: Number, required: true },
  cryptoAmount: { type: Number, required: true },
  rate: { type: Number, required: true },

  walletAddress: { type: String, required: true },
  transactionScreenshot: { type: String },

  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'UNDER_REVIEW', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },

  paidAt: { type: Date },          // screenshot upload time
  reviewStartedAt: { type: Date }, // 30 min over

  txid: { type: String },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trade', TradeSchema);
