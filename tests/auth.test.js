const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');
const { generateToken } = require('../services/authService');

// Mock User model
jest.mock('../src/models/user');
jest.mock('../services/authService');

describe('Authentication Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should create a new user', async () => {
      // Mock user data
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        role: 'admin'
      };

      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValue(null);

      // Mock User constructor and save method
      const mockUser = {
        _id: 'mock-user-id',
        email: userData.email,
        role: userData.role,
        save: jest.fn().mockResolvedValue(true)
      };
      User.mockImplementation(() => mockUser);

      // Make request
      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      // Assertions
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User created successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).toHaveProperty('role', userData.role);
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should return 400 if user already exists', async () => {
      // Mock user data
      const userData = {
        email: 'existing@example.com',
        password: 'password123'
      };

      // Mock User.findOne to return a user (user exists)
      User.findOne.mockResolvedValue({ email: userData.email });

      // Make request
      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exists');
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user and return a token', async () => {
      // Mock user data
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock authenticateUser function
      const mockAuthResult = {
        user: {
          id: 'mock-user-id',
          email: userData.email,
          role: 'admin'
        },
        token: 'mock-jwt-token'
      };

      // Mock the User.findOne and comparePassword methods
      const mockUser = {
        _id: 'mock-user-id',
        email: userData.email,
        role: 'admin',
        comparePassword: jest.fn().mockResolvedValue(true)
      };
      User.findOne.mockResolvedValue(mockUser);
      generateToken.mockReturnValue(mockAuthResult.token);

      // Make request
      const response = await request(app)
        .post('/auth/login')
        .send(userData);

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
    });

    it('should return 401 for invalid credentials', async () => {
      // Mock user data
      const userData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      // Mock the User.findOne method to return a user
      const mockUser = {
        _id: 'mock-user-id',
        email: userData.email,
        role: 'admin',
        comparePassword: jest.fn().mockResolvedValue(false) // Password doesn't match
      };
      User.findOne.mockResolvedValue(mockUser);

      // Make request
      const response = await request(app)
        .post('/auth/login')
        .send(userData);

      // Assertions
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(mockUser.comparePassword).toHaveBeenCalledWith(userData.password);
    });

    it('should return 401 if user not found', async () => {
      // Mock user data
      const userData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValue(null);

      // Make request
      const response = await request(app)
        .post('/auth/login')
        .send(userData);

      // Assertions
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
    });
  });
});
