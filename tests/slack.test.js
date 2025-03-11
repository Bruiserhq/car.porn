const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { postCandidatesToSlack, handleSlackFeedback } = require('../src/services/slack');
const Feedback = require('../src/models/feedback');
const { generateToken, verifyToken } = require('../services/authService');

// Mock the Feedback model and auth service
jest.mock('../src/models/feedback');
jest.mock('../services/authService');

// Mock console.log to avoid cluttering test output
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Slack Service', () => {
  describe('postCandidatesToSlack', () => {
    it('should log car information and return success response', () => {
      const mockCars = [
        { _id: '1', make: 'Toyota', model: 'Corolla', year: 2020, filthScore: 15 },
        { _id: '2', make: 'Honda', model: 'Civic', year: 1995, filthScore: 35 },
      ];
      
      const result = postCandidatesToSlack(mockCars);
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('timestamp');
      expect(console.log).toHaveBeenCalledTimes(3); // Once for the header, twice for cars
    });
  });
  
  describe('handleSlackFeedback', () => {
    it('should process payload and return structured feedback', () => {
      const mockPayload = {
        carIds: ['1', '2', '3'],
        notes: 'These cars look great!'
      };
      
      const result = handleSlackFeedback(mockPayload);
      
      expect(result).toHaveProperty('selectedCarIds', mockPayload.carIds);
      expect(result).toHaveProperty('feedbackNotes', mockPayload.notes);
      expect(result).toHaveProperty('processedAt');
    });
    
    it('should handle empty payload with defaults', () => {
      const result = handleSlackFeedback({});
      
      expect(result).toHaveProperty('selectedCarIds', []);
      expect(result).toHaveProperty('feedbackNotes', 'No additional notes provided');
      expect(result).toHaveProperty('processedAt');
    });
  });
});

describe('Slack Routes', () => {
  // Mock token for testing
  const mockToken = 'mock-jwt-token';
  const mockUser = {
    id: 'user-id',
    email: 'admin@example.com',
    role: 'admin'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Feedback.prototype.save
    Feedback.prototype.save = jest.fn().mockImplementation(function() {
      return Promise.resolve(this);
    });

    // Mock token verification
    generateToken.mockReturnValue(mockToken);
    verifyToken.mockImplementation((token) => {
      if (token === mockToken) {
        return mockUser;
      }
      throw new Error('Invalid token');
    });
  });
  
  describe('POST /slack/feedback', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app)
        .post('/slack/feedback')
        .send({ carIds: ['123'], notes: 'Test feedback' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Authorization token required');
    });

    it('should return 401 if invalid token is provided', async () => {
      const response = await request(app)
        .post('/slack/feedback')
        .set('Authorization', 'Bearer invalid-token')
        .send({ carIds: ['123'], notes: 'Test feedback' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should process feedback and save to database when authenticated', async () => {
      const mockPayload = {
        carIds: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
        notes: 'Approved these cars'
      };
      
      const response = await request(app)
        .post('/slack/feedback')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(mockPayload)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Feedback processed successfully');
      expect(response.body).toHaveProperty('feedback');
      expect(Feedback).toHaveBeenCalledTimes(1);
      expect(Feedback.prototype.save).toHaveBeenCalledTimes(1);
    });
    
    it('should handle errors during feedback processing', async () => {
      // Mock save to throw an error
      Feedback.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));
      
      const mockPayload = {
        carIds: ['invalid-id'],
        notes: 'This will fail'
      };
      
      const response = await request(app)
        .post('/slack/feedback')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(mockPayload)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Database error');
    });
  });
});
