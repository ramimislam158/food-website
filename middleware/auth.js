// middleware/auth.js
module.exports.requireAdmin = (req, res, next) => {
  if (req.session && req.session.isAdmin) return next();
  return res.status(401).json({ error: 'Unauthorized — please login' });
};