const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { authenticateUser } = require('../services/authService');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 'user'
    });

    // Save user
    await user.save();

    // Return success without exposing password
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Authenticate user
    const auth = await authenticateUser(email, password);

    // Return user and token
    res.status(200).json(auth);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = router;
