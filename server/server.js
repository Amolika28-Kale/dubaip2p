require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

const authRoutes = require('./routes/auth');
const exchangeRoutes = require('./routes/exchange');
const reviewRoutes = require('./routes/review');
const exchangeRateService = require('./services/exchangeRateService');
const Setting = require('./models/Setting');

const app = express();

/* ================== MIDDLEWARE ================== */
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://dubai-p2p.netlify.app'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================== STATIC UPLOADS ================== */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ================== ROUTES ================== */
app.use('/api/auth', authRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/review', reviewRoutes);

/* ================== DB CONNECT ================== */
const mongoUri =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dubaip2p';

mongoose
  .connect(mongoUri)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

/* ================== SERVER ================== */
const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`🚀 Server running on port ${port}`)
);

/* ================== CRON: RATE UPDATE ================== */
cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('⏳ Updating exchange rate...');
    const rate = await exchangeRateService.refreshRate();

    await Setting.findOneAndUpdate(
      { key: 'RATE_INR_PER_USDT' },
      { key: 'RATE_INR_PER_USDT', value: rate },
      { upsert: true }
    );

    console.log(`✅ Rate updated: ${rate} INR/USDT`);
  } catch (err) {
    console.error('❌ Rate update failed:', err.message);
  }
});
