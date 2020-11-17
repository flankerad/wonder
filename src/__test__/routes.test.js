import supertest from 'supertest';
import assert from 'assert';
import { server } from '../routes.js';

let app = server;
describe('Publish', () => {
    it('should publish a new message', (done) => {
        const request = supertest(app)
                            .post('/publish')
                            .send({ message: "message" })
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .end((err, res) => {
                                if (err) return done(err);
                                console.log(res.body);
                                assert(res.body.text, 'Message Published to queue')
                                done();
                              });
                        })
})



