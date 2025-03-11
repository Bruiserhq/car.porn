const express = require('express');
const mongoose = require('mongoose');
const carsRoutes = require('./routes/cars');
const slackRoutes = require('./routes/slack');
const authRoutes = require('./routes/auth');

// Create Express application
const app = express();

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/car-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// Middleware
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

// Use routes
app.use('/cars', carsRoutes);
app.use('/slack', slackRoutes);
app.use('/auth', authRoutes);

// Export app for testing
module.exports = app;
