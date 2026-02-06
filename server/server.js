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
const { MONGO_URI, PORT } = process.env;

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://dubai-p2p.netlify.app' // Tumchi Netlify chi URL ithe taka
  ],
  credentials: true
}));app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/review', reviewRoutes);

const mongoUri = MONGO_URI || 'mongodb://127.0.0.1:27017/dubaip2p';
mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error', err));

const port = PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));

// Schedule rate updates every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('Updating exchange rate...');
    const rate = await exchangeRateService.refreshRate();
    await Setting.findOneAndUpdate(
      { key: 'RATE_INR_PER_USDT' },
      { key: 'RATE_INR_PER_USDT', value: rate },
      { upsert: true }
    );
    console.log(`Exchange rate updated to ${rate} INR/USDT`);
  } catch (error) {
    console.error('Failed to update exchange rate:', error.message);
  }
});
