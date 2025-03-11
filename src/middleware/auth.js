const { verifyToken } = require('../services/authService');

/**
 * Authentication middleware
 * Verifies JWT token in Authorization header
 */
function authenticate(req, res, next) {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Add user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

/**
 * Role-based authorization middleware
 * @param {String[]} roles - Array of allowed roles
 */
function authorize(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorize
};
