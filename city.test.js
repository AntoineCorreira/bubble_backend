const request = require('supertest');
const app = require('../backend/app'); 
const mongoose = require('mongoose');
const Establishment = require('../backend/models/establishments');

describe('GET /establishments/city', () => {
  afterAll(async () => {
   
    await mongoose.disconnect();
  });

  it('renvoie une liste de ville', async () => {
    const res = await request(app).get('/establishments/city');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining(['Paris', 'Bordeaux', 'Marseille']));
  });
});

