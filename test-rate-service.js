const exchangeRateService = require('./server/services/exchangeRateService');

async function testRateService() {
  try {
    console.log('Testing exchange rate service...');
    const rate = await exchangeRateService.getUSDTToINR();
    console.log('Fetched rate:', rate);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testRateService();
