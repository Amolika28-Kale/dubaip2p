const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  // 🔑 Added 'type' to distinguish flows
  type: { type: String, enum: ['BUY', 'SELL'], default: 'BUY' }, 
  
  sendMethod: { type: String, required: true },
  receiveMethod: { type: String, required: true },

  fiatAmount: { type: Number, required: true },
  cryptoAmount: { type: Number, required: true },
  rate: { type: Number, required: true },

  walletAddress: { type: String, required: true },
   // 🔥 NEW FIELD (SELL only)
  virtualWallet: {
    address: String,
    network: String
  },

  transactionScreenshot: { type: String },

  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'UNDER_REVIEW', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },

  paidAt: { type: Date },
  reviewStartedAt: { type: Date },
  txid: { type: String },
  rejectionReason: { type: String }, // 🔑 Added for Cancelled status

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trade', TradeSchema);