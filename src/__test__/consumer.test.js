import supertest from 'supertest';
import assert from 'assert';
import { server } from '../routes.js';
import { Message } from '../data.js';
import { publishToQueue, fetchMessages } from '../queue.js';
import { consumer } from '../consumer.js';
import { cid } from '../config.js';


describe('Consumer for message queue', () => {
    let id = cid;
    let messageId;
    beforeEach( async() => {
        let message = new Message('message');
        messageId = await publishToQueue(message);
    });

    it('should fetch and processes messages from queue', async (done) => {
    /* Some async code testing. */
        try {
            let messages = await consumer(id);
            done();
            // console.log(messages)
            expect(messageId).toBe(messages[0]._messageId);
        } catch (err) {
            console.log("Error occured while calling Consumer TEST")
            console.log(err)
            done();
        }
    });
});