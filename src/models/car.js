const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  filthScore: {
    type: Number,
    default: null,
  },
  description: {
    type: String,
    default: 'No description available.',
  },
});

module.exports = mongoose.model('Car', carSchema);
