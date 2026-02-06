const path = require('path');
const fs = require('fs');
const Trade = require('../models/Trade');
const PaymentDetail = require('../models/PaymentDetail');
const Setting = require('../models/Setting');
const { RATE_INR_PER_USDT, RESERVES } = require('../config');
const exchangeRateService = require('../services/exchangeRateService');

async function getRateFromDB() {
  try {
    console.log('Checking for rate in DB...');
    const r = await Setting.findOne({ key: 'RATE_INR_PER_USDT' }).lean();
    console.log('DB rate result:', r);
    if (r && r.value) {
      console.log('Returning DB rate:', Number(r.value));
      return Number(r.value);
    }

    // If no rate in DB, fetch real rate and store it
    console.log('No rate found in DB, fetching real rate...');
    const realRate = await exchangeRateService.getUSDTToINR();
    console.log('Fetched real rate:', realRate);
    await Setting.findOneAndUpdate(
      { key: 'RATE_INR_PER_USDT' },
      { key: 'RATE_INR_PER_USDT', value: realRate },
      { upsert: true }
    );
    console.log('Stored real rate in DB');
    return realRate;
  } catch (e) {
    console.error('Error reading rate from DB, falling back to config:', e);
    return RATE_INR_PER_USDT;
  }
}

exports.initiateExchange = async (req, res) => {
  try {
    const { sendMethod, receiveMethod, fiatAmount, walletAddress } = req.body;
    if (!sendMethod || !receiveMethod || !fiatAmount || !walletAddress) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const rate = await getRateFromDB();
    const cryptoAmount = parseFloat((fiatAmount / rate).toFixed(6));

    const trade = await Trade.create({
      userId: req.userId,
      sendMethod,
      receiveMethod,
      fiatAmount,
      cryptoAmount,
      rate,
      walletAddress,
      status: 'PENDING'
    });

    return res.json({ trade });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { tradeId } = req.body;
    if (!tradeId) return res.status(400).json({ message: 'tradeId required' });

    const trade = await Trade.findById(tradeId);
    if (!trade) return res.status(404).json({ message: 'Trade not found' });

    if (!req.file) return res.status(400).json({ message: 'screenshot file required' });

    // store relative path
    trade.transactionScreenshot = `/uploads/${req.file.filename}`;
    trade.status = 'PAID';
    await trade.save();

    return res.json({ trade });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.adminList = async (req, res) => {
  try {
    const all = await Trade.find().sort({ createdAt: -1 }).lean();
    // Populate user details for each trade
    const tradesWithUsers = await Promise.all(all.map(async (trade) => {
      if (trade.userId) {
        const User = require('../models/User');
        const user = await User.findById(trade.userId).select('email username balance referralCode createdAt').lean();
        return { ...trade, user };
      }
      return trade;
    }));
    // Put PAID first
    const paid = tradesWithUsers.filter((t) => t.status === 'PAID');
    const others = tradesWithUsers.filter((t) => t.status !== 'PAID');
    return res.json({ trades: [...paid, ...others] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getRate = async (req, res) => {
  try {
    const rate = await getRateFromDB();
    return res.json({ rate });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.setRate = async (req, res) => {
  try {
    const { rate } = req.body;
    if (!rate) return res.status(400).json({ message: 'rate required' });

    await Setting.findOneAndUpdate(
      { key: 'RATE_INR_PER_USDT' },
      { key: 'RATE_INR_PER_USDT', value: Number(rate) },
      { upsert: true }
    );

    return res.json({ rate: Number(rate) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.releaseAssets = async (req, res) => {
  try {
    const { tradeId, txid } = req.body;
    if (!tradeId || !txid) return res.status(400).json({ message: 'tradeId and txid required' });

    const trade = await Trade.findById(tradeId);
    if (!trade) return res.status(404).json({ message: 'Trade not found' });

    if (trade.status !== 'PAID') return res.status(400).json({ message: 'Trade not in PAID status' });

    trade.status = 'COMPLETED';
    trade.txid = txid;
    await trade.save();

    return res.json({ trade });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.latest = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const trades = await Trade.find().sort({ createdAt: -1 }).limit(limit).lean();
    return res.json({ trades });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.reserves = async (req, res) => {
  try {
    const reserves = {
      'USDT (TRC20)': '8,072 USD',
      'USDT (BEP20)': '8,778 USD',
      'USDT (TRON)': '6,850 USD',
      'Bank Transfer': '578,946 INR'
    };
    return res.json({ reserves });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getTrade = async (req, res) => {
  try {
    const { tradeId } = req.params;
    const trade = await Trade.findById(tradeId);
    if (!trade) return res.status(404).json({ message: 'Trade not found' });
    return res.json({ trade });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getPaymentDetails = async (req, res) => {
  try {
    const details = await PaymentDetail.find({ active: true }).lean();
    return res.json({ details });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.setPaymentDetails = async (req, res) => {
  try {
    const { method, details } = req.body;
    if (!method || !details) return res.status(400).json({ message: 'method and details required' });

    const existing = await PaymentDetail.findOne({ method });
    if (existing) {
      existing.details = details;
      await existing.save();
    } else {
      await PaymentDetail.create({ method, details, active: true });
    }

    const all = await PaymentDetail.find({ active: true }).lean();
    return res.json({ details: all });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.myTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
    return res.json({ trades });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.rejectTrade = async (req, res) => {
  try {
    const { tradeId, reason } = req.body;
    if (!tradeId) return res.status(400).json({ message: 'tradeId required' });

    const trade = await Trade.findById(tradeId);
    if (!trade) return res.status(404).json({ message: 'Trade not found' });

    trade.status = 'CANCELLED';
    trade.rejectionReason = reason || 'Rejected by admin';
    await trade.save();

    return res.json({ trade });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getReserves = async (req, res) => {
  try {
    const s = await Setting.findOne({ key: 'RESERVES' }).lean();
    if (s && s.value) return res.json({ reserves: s.value });
    // fallback
    return res.json({ reserves: RESERVES || {} });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.adminStats = async (req, res) => {
  try {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const totalTrades = await Trade.countDocuments();
    const activeRequests = await Trade.countDocuments({ status: { $in: ['PENDING', 'PAID'] } });
    const paidCount = await Trade.countDocuments({ status: 'PAID' });
    const completedCount = await Trade.countDocuments({ status: 'COMPLETED' });

    const dailyVolumeAgg = await Trade.aggregate([
      { $match: { createdAt: { $gte: dayAgo } } },
      { $group: { _id: null, totalFiat: { $sum: '$fiatAmount' }, count: { $sum: 1 } } }
    ]);
    const dailyVolume = (dailyVolumeAgg[0] && dailyVolumeAgg[0].totalFiat) || 0;

    const activeUsersAgg = await Trade.aggregate([
      { $match: { createdAt: { $gte: dayAgo } } },
      { $group: { _id: '$userId' } },
      { $count: 'activeUsers' }
    ]);
    const activeUsers = (activeUsersAgg[0] && activeUsersAgg[0].activeUsers) || 0;

    return res.json({ totalTrades, activeRequests, paidCount, completedCount, dailyVolume, activeUsers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// controllers/tradeController.js

exports.getOperatorStatus = async (req, res) => {
  try {
    const s = await Setting.findOne({ key: 'OPERATOR_ONLINE' }).lean();
    return res.json({ online: s ? s.value : false });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.setOperatorStatus = async (req, res) => {
  try {
    const { online } = req.body;
    const updated = await Setting.findOneAndUpdate(
      { key: 'OPERATOR_ONLINE' }, 
      { key: 'OPERATOR_ONLINE', value: !!online }, 
      { upsert: true, new: true }
    );
    return res.json({ online: updated.value });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.setReserves = async (req, res) => {
  try {
    const { reserves } = req.body;
    if (!reserves || typeof reserves !== 'object') return res.status(400).json({ message: 'reserves object required' });

    await Setting.findOneAndUpdate({ key: 'RESERVES' }, { key: 'RESERVES', value: reserves }, { upsert: true });
    return res.json({ reserves });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
