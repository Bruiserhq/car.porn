const express = require('express');

// Create Express application
const app = express();

// Define routes
app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

// Export app for testing
module.exports = app;
