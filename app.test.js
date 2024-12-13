const request = require('supertest');
const app = require('./app');

const validData = {
    startDate: '13/12/2024',
    endDate: '13/12/2024',
    parentFirstname: 'Antoine',
    parentName: 'Correira',
    childrenName: 'Lio',
    establishmentName: 'Crèche Bordeaux 1',
    establishmentZip: '33000',
    status: 'Pending',
}

describe('POST /reservation', () => {
    it('should create a reservation successfully with valid data', async () => {
        const res = await request(app)
            .post('/reservation')
            .send(validData);
            
        expect(res.statusCode).toBe(200);
        expect(res.body.result).toBe(true);
    });

    Object.keys(validData).forEach((field) => { //Object.keys(validData) pour obtenir toutes les clés de validData
        it(`should fail to create a reservation when ${field} is missing`, async () => {
            const invalidData = { ...validData };  // On crée une copie pour ne pas modifier l'original
            delete invalidData[field];  // On retire le champ de la copie

            const res = await request(app)
                .post('/reservation')
                .send(invalidData); // On envoie les données avec un champ manquant

            expect(res.statusCode).toBe(400);
            expect(res.body.result).toBe(false);
            expect(res.body.message).toContain(`Missing required ${field}`);
        });
    });
});