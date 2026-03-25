const jwt = require('jsonwebtoken');
const { jwtSecret, nodeEnv } = require('../config/env');
const db = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret);

    // In non-production demo mode, login may issue id=0 tokens when DB is offline.
    if (nodeEnv !== 'production' && Number(decoded?.id) === 0) {
      req.user = {
        id: 0,
        role: decoded.role || 'member',
        name: decoded.role === 'admin' ? 'Admin Demo' : 'Member Demo',
        email: decoded.role === 'admin' ? 'admin@fittrack.com' : 'member@fittrack.com'
      };
      return next();
    }

    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};

module.exports = authenticate;
