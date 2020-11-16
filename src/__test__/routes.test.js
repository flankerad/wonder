const request = require('supertest');
const app = require('../server.js');

describe('Publish', () => {
    it('should publish a new message', () => {
        const res = request(app)
            .post('/publish')
            .send({
                message: "message"
            });
        expect(res.statusCode).toEqual(200);
    })
})



