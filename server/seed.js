const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Only run seeding when SEED environment variable is explicitly set to 'true'
const SHOULD_SEED = process.env.SEED === 'true';
if (!SHOULD_SEED) {
  console.log('SEED not enabled. Skipping database seeding. To seed, run: SEED=true node seed.js');
  process.exit(0);
}

const User = require('./models/User');
const Trade = require('./models/Trade');
const PaymentDetail = require('./models/PaymentDetail');
const Setting = require('./models/Setting');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dubaip2p';

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Trade.deleteMany({});
    await PaymentDetail.deleteMany({});
    await Setting.deleteMany({});
    console.log('Cleared existing data');

    // Seed Admin User Only
await User.create({ 
  name: 'Admin User', // 🔑 Added this missing field
  email: 'admin@dubaip2p.com', 
  password: 'admin1234', 
  username: 'admin', 
  isAdmin: true, 
  isEmailVerified: true 
});    console.log('✓ Admin user created');

    // Seed Payment Details
    await PaymentDetail.insertMany([
      {
        method: 'UPI',
        details: {
          upiId: 'amolikakale234@okhdfcbank',
          name: 'DubaiP2P Exchange',
          phone: '+91-8625043745'
        },
        active: true
      },
      {
        method: 'BANK',
        details: {
          accountName: 'DubaiP2P Exchange Ltd',
          accountNumber: '13058100003991',
          ifsc: 'BARB0VELAPU',
          bankName: 'HDFC Bank'
        },
        active: true
      },
      {
    method: 'USDT-TRC20',
    details: {
      address: 'TGTmCXghBxNAkUxeL7hnDPjQiQicKG26v2',
      network: 'TRON (TRC20)'
    },
    active: true
  },
  {
    method: 'USDT-BEP20',
    details: {
      address: '0xa91D8Ba3029FC14907cb4bEE60763869f0eD88f7',
      network: 'BSC (BEP20)'
    },
    active: true
  }
    ]);
    console.log('✓ Payment details seeded');

    // Seed Exchange Rate
    await Setting.create({
      key: 'RATE_INR_PER_USDT',
      value: 82.5
    });
    console.log('✓ Rate initialized at 82.5 INR/USDT');

    console.log('\n✅ Admin seeding completed successfully!');
    console.log('\n📝 Admin Credentials:');
    console.log('  Admin User: admin@dubaip2p.com / admin1234');
    console.log('\n💱 Exchange Rate: 1 USDT = ₹82.5');
    console.log('\n🏦 Payment Methods Configured:');
    console.log('  UPI: merchant@okhdfcbank');
    console.log('  Bank Account: 1234567890123456 (HDFC0001234)');

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
