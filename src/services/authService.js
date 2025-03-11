const jwt = require('jsonwebtoken');
const User = require('../models/user');

// JWT secret key - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRATION = '24h';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
function generateToken(user) {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRATION }
  );
}

/**
 * Verify a JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

/**
 * Authenticate a user with email and password
 * @param {String} email - User email
 * @param {String} password - User password
 * @returns {Object} User object and token
 */
async function authenticateUser(email, password) {
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      email: user.email,
      role: user.role
    },
    token
  };
}

module.exports = {
  generateToken,
  verifyToken,
  authenticateUser
};
