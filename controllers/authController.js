const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'replace-with-a-secret';
const ACCESS_EXPIRES_IN = '8h';

const signToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );

const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    const token = signToken(user);
    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Could not create user' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);
    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Login failed' });
  }
};

const profile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id, email, name } = req.user;
  return res.json({ id, email, name });
};

module.exports = { register, login, profile };

