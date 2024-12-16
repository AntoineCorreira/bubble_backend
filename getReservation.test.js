const request = require('supertest');
const app = require('./app');

it('GET /allReservation - Should retrieve all reservations with correct structure', async () => {
    // Effectuer la requête GET
    const res = await request(app).get('/allReservation');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((reservation) => {
        expect(reservation).toHaveProperty('startDate');
        expect(typeof reservation.startDate).toBe('string'); 
        expect(reservation).toHaveProperty('endDate');
        expect(typeof reservation.endDate).toBe('string');

        expect(reservation).toHaveProperty('parent');
        expect(mongoose.Types.ObjectId.isValid(objectId)).toBe(true)

        expect(reservation).toHaveProperty('establishment');
        expect(mongoose.Types.ObjectId.isValid(objectId)).toBe(true)

        expect(reservation).toHaveProperty('status');
        expect(typeof reservation.status).toBe('string'); 
    });
});
