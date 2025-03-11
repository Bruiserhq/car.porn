const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Car = require('../src/models/car');
const { generateDescription } = require('../src/services/contentGenerator');

// Mock the content generator
jest.mock('../src/services/contentGenerator');

// Mock mongoose connection
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');
  return {
    ...originalModule,
    connect: jest.fn().mockResolvedValue(true),
  };
});

describe('GET /', () => {
  it('should return status 200 and "Hello World" text', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World');
  });
});

describe('Car API', () => {
  beforeEach(async () => {
    // Clear the Car collection before each test
    jest.spyOn(Car, 'find').mockResolvedValue([]);
    jest.spyOn(Car.prototype, 'save').mockImplementation(function () {
      return Promise.resolve(this);
    });
    
    // Mock the description generation
    generateDescription.mockImplementation((car) => {
      return `Mock description for ${car.year} ${car.make} ${car.model}`;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /cars', () => {
    it('should return all cars', async () => {
      const mockCars = [
        { _id: '1', make: 'Toyota', model: 'Corolla', year: 2020, filthScore: 5 },
        { _id: '2', make: 'Honda', model: 'Civic', year: 2019, filthScore: 3 },
      ];

      Car.find.mockResolvedValue(mockCars);

      const response = await request(app).get('/cars');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCars);
      expect(Car.find).toHaveBeenCalled();
    });
  });

  describe('POST /cars', () => {
    it('should create a new car with valid data', async () => {
      const carData = {
        make: 'Ford',
        model: 'Mustang',
        year: 2021,
        filthScore: 1,
      };

      const response = await request(app)
        .post('/cars')
        .send(carData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('make', carData.make);
      expect(response.body).toHaveProperty('model', carData.model);
      expect(response.body).toHaveProperty('year', carData.year);
      expect(response.body).toHaveProperty('filthScore', carData.filthScore);
      expect(response.body).toHaveProperty('description');
      expect(response.body.description).toContain(carData.make);
    });

    it('should return 400 if required fields are missing', async () => {
      // Mock the save method to throw an error for validation
      Car.prototype.save.mockRejectedValue(new Error('Validation failed'));

      const invalidCarData = {
        make: 'Ford',
        // Missing model and year
        filthScore: 1,
      };

      const response = await request(app)
        .post('/cars')
        .send(invalidCarData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
});
