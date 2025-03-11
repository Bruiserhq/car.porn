const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
  it('should return status 200 and "Hello World" text', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World');
  });
});
