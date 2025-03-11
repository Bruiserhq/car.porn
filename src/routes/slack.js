const express = require('express');
const router = express.Router();
const { handleSlackFeedback } = require('../services/slack');
const Feedback = require('../models/feedback');
const { authenticate, authorize } = require('../middleware/auth');

// POST feedback from Slack - protected route
router.post('/feedback', authenticate, authorize(['admin', 'curator']), async (req, res) => {
  try {
    // Process the incoming Slack payload
    const processedFeedback = handleSlackFeedback(req.body);
    
    // Create a new feedback record
    const feedback = new Feedback({
      selectedCarIds: processedFeedback.selectedCarIds,
      feedbackNotes: processedFeedback.feedbackNotes,
      processedAt: processedFeedback.processedAt,
    });
    
    // Save the feedback to the database
    const savedFeedback = await feedback.save();
    
    res.status(201).json({
      message: 'Feedback processed successfully',
      feedback: savedFeedback
    });
  } catch (error) {
    console.error('Error processing Slack feedback:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
