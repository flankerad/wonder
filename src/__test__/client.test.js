import supertest from 'supertest';
import assert, { fail } from 'assert';
import { server } from '../routes.js';
import { Message } from '../data.js';
import { publishToQueue, fetchMessages } from '../queue.js';
import { consumer, deleteMessageFromQueue } from '../consumer.js';
import { publisher } from '../publisher.js';

import { cid } from '../config.js';




describe('Publisher for message queue', () => {
    let id = cid;
    let messageId;


    it('should publish message to queue', async (done) => {
        try {

            let message = new Message('message');
            messageId = await publishToQueue(message);
            done();

        } catch (err) {
            console.log("Error occured while calling Publisher TEST", err)
            fail(err)
        }
    });
});

describe('Consumer for message queue', () => {
    it('should fetch and processes messages from queue', async(done) => {
        try {

            var messageId = await publisher();
            var messages = await consumer(cid);
            // expect(messageId.messageId).toBe(messages[1]._id);
            done();

        } catch (err) {
            console.log("Error occured while calling Consumer TEST", err)
            fail(err)
        }
    });
});


describe('Delelte message in queue', () => {
    it('should fetch and processes messages from queue', async(done) => {
        try {

            await publisher();
            await consumer(cid);
            var isDeleted = await deleteMessageFromQueue(1)
            expect(isDeleted).toBe("true");
            done();

        } catch (err) {

            console.log("Error occured while calling Delete TEST", err)
            fail(err)
        }
    });
});