const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'replace-with-a-secret';

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const token = header.replace('Bearer ', '').trim();

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(payload.sub, { attributes: ['id', 'name', 'email'] });
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    return next();
  } catch (err) {
    console.error('JWT verify failed', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticate };

