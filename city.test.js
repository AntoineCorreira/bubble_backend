const request = require('supertest');
const app = require('../bubble_backend/app'); 
const mongoose = require('mongoose');
const Establishment = require('../bubble_backend/models/establishments');

describe('GET /establishments/city', () => {
  afterAll(async () => {
   
    await mongoose.disconnect();
  });

  it('should return a list of distinct cities', async () => {
    const res = await request(app).get('/establishments/city');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining(['Paris', 'Bordeaux', 'Marseille']));
  });
});

