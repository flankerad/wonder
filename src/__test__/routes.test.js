import supertest from 'supertest';
import assert from 'assert';
import { server } from '../routes.js';
import { Message } from '../data.js';
import { publishToQueue, fetchMessages } from '../queue.js';

let app = server;
const request = supertest(app);


describe('Publish', () => {
    it('should publish a new message', (done) => {
        request.post('/publish')
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


describe('Consume', () => {
    it('Consume a message from queue', (done) => {
        request.get('/consume?consumerId=007')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    console.log("Result "+JSON.stringify(res.body));
                    done();
                    });
            })
});

