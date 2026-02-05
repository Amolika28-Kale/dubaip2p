const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const API = 'http://localhost:4000/api';
const User = require('./models/User');
const Trade = require('./models/Trade');

let testUser, adminUser;
let adminToken, testUserToken;
let tradeId;

async function logStep(step, message) {
  console.log(`\n[Step ${step}] ${message}`);
}

async function testAdminFlow() {
  try {
    // Connect to MongoDB
    await logStep(1, 'Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dubaip2p');
    console.log('✓ MongoDB connected');

    // Clean up test data
    await logStep(2, 'Cleaning up test data...');
    await User.deleteMany({ email: { $in: ['testuser@test.com', 'admin@dubaip2p.com'] } });
    console.log('✓ Test data cleaned');

    // Create test users
    await logStep(3, 'Creating test users...');
    testUser = await User.create({
      email: 'testuser@test.com',
      password: 'test1234',
      username: 'testuser',
      isAdmin: false
    });
    console.log('✓ Test user created');

    adminUser = await User.create({
      email: 'admin@dubaip2p.com',
      password: 'admin1234',
      username: 'admin',
      isAdmin: true
    });
    console.log('✓ Admin user created');

    // Login as test user
    await logStep(4, 'Logging in as test user...');
    const userLoginRes = await axios.post(`${API}/auth/login`, {
      email: 'testuser@test.com',
      password: 'test1234'
    });
    testUserToken = userLoginRes.data.token;
    console.log('✓ Test user logged in');
    console.log(`  Token: ${testUserToken.substring(0, 20)}...`);

    // Login as admin
    await logStep(5, 'Logging in as admin...');
    const adminLoginRes = await axios.post(`${API}/auth/login`, {
      email: 'admin@dubaip2p.com',
      password: 'admin1234'
    });
    adminToken = adminLoginRes.data.token;
    console.log('✓ Admin logged in');
    console.log(`  Token: ${adminToken.substring(0, 20)}...`);

    // Create a trade as test user
    await logStep(6, 'Creating a trade as test user...');
    const tradeRes = await axios.post(`${API}/exchange/initiate`, {
      sendMethod: 'INR-UPI',
      receiveMethod: 'USDT-TRC20',
      fiatAmount: 50000,
      walletAddress: 'TRC20_TEST_WALLET'
    }, {
      headers: { Authorization: `Bearer ${testUserToken}` }
    });
    tradeId = tradeRes.data.trade._id;
    console.log('✓ Trade created');
    console.log(`  Trade ID: ${tradeId}`);
    console.log(`  Status: ${tradeRes.data.trade.status}`);

    // Admin list trades
    await logStep(7, 'Admin fetching trade list...');
    const listRes = await axios.get(`${API}/exchange/admin/list`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Trades listed');
    console.log(`  Total trades: ${listRes.data.trades.length}`);
    console.log(`  Our trade in list: ${listRes.data.trades.some(t => t._id === tradeId) ? 'YES' : 'NO'}`);

    // Get specific trade
    await logStep(8, 'Admin fetching specific trade...');
    const getTradeRes = await axios.get(`${API}/exchange/trade/${tradeId}`);
    console.log('✓ Trade fetched');
    console.log(`  User: ${getTradeRes.data.trade.userId}`);
    console.log(`  Amount: ${getTradeRes.data.trade.fiatAmount} INR`);
    console.log(`  Status: ${getTradeRes.data.trade.status}`);

    // Manually update trade to PAID (simulate payment confirmation)
    await logStep(9, 'Simulating payment confirmation (PAID)...');
    await Trade.findByIdAndUpdate(tradeId, { status: 'PAID' });
    console.log('✓ Trade marked as PAID');

    // Admin release assets
    await logStep(10, 'Admin releasing assets (setting COMPLETED + txid)...');
    const releaseRes = await axios.post(`${API}/exchange/admin/release`, {
      tradeId: tradeId,
      txid: '0xtest123456789abcdef'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Trade released');
    console.log(`  New status: ${releaseRes.data.trade.status}`);
    console.log(`  TXID: ${releaseRes.data.trade.txid}`);

    // Verify trade is COMPLETED
    await logStep(11, 'Verifying trade status...');
    const finalRes = await axios.get(`${API}/exchange/trade/${tradeId}`);
    console.log('✓ Trade verified');
    console.log(`  Final Status: ${finalRes.data.trade.status}`);
    console.log(`  Final TXID: ${finalRes.data.trade.txid}`);

    // Admin stats
    await logStep(12, 'Fetching admin stats...');
    const statsRes = await axios.get(`${API}/exchange/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Stats fetched');
    console.log(`  Total trades: ${statsRes.data.totalTrades}`);
    console.log(`  Completed: ${statsRes.data.completedCount}`);
    console.log(`  Paid: ${statsRes.data.paidCount}`);
    console.log(`  Active requests: ${statsRes.data.activeRequests}`);
    console.log(`  Daily volume: ${statsRes.data.dailyVolume} INR`);

    console.log('\n✅ ADMIN FLOW TEST COMPLETED SUCCESSFULLY!\n');

    process.exit(0);
  } catch (err) {
    console.error('\n❌ TEST FAILED:');
    console.error(err.response?.data || err.message);
    process.exit(1);
  }
}

testAdminFlow();
