const axios = require('axios');

class ExchangeRateService {
  constructor() {
    this.apiUrl = 'https://api.coingecko.com/api/v3/simple/price';
    this.cache = {
      rate: null,
      lastUpdated: null,
      ttl: 5 * 60 * 1000 // 5 minutes
    };
    // 🔑 Margin configuration (Optional but recommended)
    this.buyMargin = 0.5;  // Add 0.5 INR to market rate when users BUY
    this.sellMargin = 1.0; // Subtract 1.0 INR from market rate when users SELL
  }

  async fetchUSDTToINR() {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          ids: 'tether',
          vs_currencies: 'inr'
        }
      });

      const rate = response.data.tether.inr;
      this.cache.rate = rate;
      this.cache.lastUpdated = Date.now();

      console.log(`Fetched Market USDT/INR rate: ${rate}`);
      return rate;
    } catch (error) {
      console.error('Error fetching exchange rate:', error.message);
      throw error;
    }
  }

  async getMarketRate() {
    if (this.cache.rate && this.cache.lastUpdated &&
        (Date.now() - this.cache.lastUpdated) < this.cache.ttl) {
      return this.cache.rate;
    }
    return await this.fetchUSDTToINR();
  }

  // 📈 Rate for users BUYING USDT (Market + Margin)
  async getBuyRate() {
    const marketRate = await this.getMarketRate();
    return Number((marketRate + this.buyMargin).toFixed(2));
  }

  // 📉 Rate for users SELLING USDT (Market - Margin)
  async getSellRate() {
    const marketRate = await this.getMarketRate();
    return Number((marketRate - this.sellMargin).toFixed(2));
  }

  async refreshRate() {
    this.cache.rate = null;
    this.cache.lastUpdated = null;
    return await this.fetchUSDTToINR();
  }
}

module.exports = new ExchangeRateService();