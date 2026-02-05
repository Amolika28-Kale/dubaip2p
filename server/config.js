module.exports = {
  // Rate = INR per USDT (fallback rate, real rates fetched from API)
  RATE_INR_PER_USDT: 83.0,
  RESERVES: {
    usdtReserve: 50000,
    bankReserveINR: 1000000
  },
  // Admin token used for simple admin-only endpoints (override with env ADMIN_TOKEN)
  ADMIN_TOKEN: process.env.ADMIN_TOKEN || 'changeme_admin_token'
};
