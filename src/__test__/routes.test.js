import supertest from 'supertest';
import assert , { fail } from 'assert';
import { server } from '../routes.js';
import { sendMessage, recieveMessage } from '../config.js';
import { publishToQueue, fetchMessages } from '../queue.js';

let app = server;
const request = supertest(app);


describe('RoutesPublish', () => {
    it('should publish a new message', (done) => {
        request.post(sendMessage)
            .send({ message: "message" })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) fail(err);
                assert(res.body.text, 'Message Published to queue')
                done();
            });
    })
});


describe('Consume', () => {
    it('Consume a message from queue', (done) => {
        request.get(recieveMessage+'?cid=007')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) fail(err);
                    done();
                    });
            })
});

describe('Delete', () => {
    it('Delete a message from queue', (done) => {
        request.delete(recieveMessage+'?cid=007&id=0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) fail(err);
                    done();
                    });
            })
});