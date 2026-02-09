const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    console.log('ADMIN CHECK:', req.user);

    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = adminOnly;
