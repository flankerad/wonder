import supertest from 'supertest';
import assert from 'assert';
import { server } from '../routes.js';
import { Message } from '../data.js';
import { publishToQueue, fetchMessages } from '../queue.js';
import { consumer } from '../consumer.js';
import { cid } from '../config.js';




describe('Publisher for message queue', () => {
    let id = cid;
    let messageId;
    beforeEach( async() => {
        let message = new Message('message');
        messageId = await publishToQueue(message);
    });

    it('should publish message to queue', async (done) => {
        try {
            let message = new Message('message');
            messageId = await publishToQueue(message);
            console.log("Published Message Id", messageId)
            done();
        } catch (err) {
            console.log("Error occured while calling Publisher TEST")
            console.log(err)
            done();
        }
    });
});

describe('Consumer for message queue', () => {
    it('should fetch and processes messages from queue', async (done) => {
        try {
            var message = new Message('message');
            var messageId = await publishToQueue(message);
            var messages = await consumer(cid);
            expect(messageId).toBe(messages.get(0)._messageId);
            done();
        } catch (err) {

            console.log("Error occured while calling Consumer TEST")
            console.log(err)
            done();
        }
    });
});