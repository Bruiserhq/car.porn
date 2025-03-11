const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  selectedCarIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  }],
  feedbackNotes: {
    type: String,
    default: ''
  },
  processedAt: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'slack'
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
