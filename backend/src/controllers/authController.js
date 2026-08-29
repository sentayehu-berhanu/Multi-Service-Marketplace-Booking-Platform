const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const generateTokens = (user) => {
  const payload = {
    id: user.id,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refreshSecret', { expiresIn: '30d' });

  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Default to CUSTOMER if not provided or invalid
    const validRoles = ['CUSTOMER', 'BUSINESS_OWNER', 'STAFF', 'ADMIN'];
    const userRole = validRoles.includes(role) ? role : 'CUSTOMER';

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password_hash,
        role: userRole,
      }
    });

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
