const { ADMIN_TOKEN } = require('../config');

module.exports = function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.adminToken;
  if (!token || token !== process.env.ADMIN_TOKEN && token !== ADMIN_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized - admin only' });
  }
  next();
};
