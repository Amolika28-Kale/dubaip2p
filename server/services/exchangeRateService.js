const axios = require('axios');

class ExchangeRateService {
  constructor() {
    this.apiUrl = 'https://api.coingecko.com/api/v3/simple/price';
    this.cache = {
      rate: null,
      lastUpdated: null,
      ttl: 5 * 60 * 1000 // 5 minutes
    };
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

      console.log(`Fetched real USDT/INR rate: ${rate}`);
      return rate;
    } catch (error) {
      console.error('Error fetching exchange rate:', error.message);
      throw error;
    }
  }

  async getUSDTToINR() {
    // Return cached rate if it's still valid
    if (this.cache.rate && this.cache.lastUpdated &&
        (Date.now() - this.cache.lastUpdated) < this.cache.ttl) {
      return this.cache.rate;
    }

    // Fetch new rate
    return await this.fetchUSDTToINR();
  }

  // Force refresh the rate
  async refreshRate() {
    this.cache.rate = null;
    this.cache.lastUpdated = null;
    return await this.fetchUSDTToINR();
  }
}

module.exports = new ExchangeRateService();
