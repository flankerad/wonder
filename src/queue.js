/**
 * Messages of WonderQ are stored in Queue
 */
import { v4 as uuidv4 } from 'uuid';
import { Queue } from './data.js';
import { maxTime } from './config.js'

class WonderQ extends Queue {
    constructor(name) {
        super(100);
        this._name = name;
    }

    getQueueName() {
        return this._name
    }

    publishMessage(message) {
        message._id = uuidv4();
        this.enqueue(message);
        return message._id;
    };

    recieveMessages(cid, limit) {
        //Implements receive message for Q
        // Pull get messages from queue
        // set processing consumer Id

        let i = 0,
            returnMap = new Map();

        for (let [key, message]  of this._messages) {

            if (!message._consumerId  && i < limit) {

                message._consumerId = cid;
                message._timestamp = Date.now()
                returnMap.set(key, message)

            } else {
                break;
            }
        }

        return returnMap;

    };

    deleteMessages(cid, key) {
        // Delete processed message requested by Consumer

        let message = this._messages.get(key)
        if (message._consumerId == cid) {
            this.dequeue(key)
        }
    }

    unlockMessages() {

        // When current time has exceed processing time
        // Remove consumer Id from unprocessed messages
        // making them available for other consumers to pick

        let currTime = Date.now();

        for (let [key, message]  of this._messages) {

            let processingTime = message._timestamp + maxTime;

            if (currTime > processingTime) {
                message._consumerId = "";
            }
        }
    }
}

export const wonderQ = new WonderQ('wonder');


export const publishToQueue = (message) => {

    // Function parses request body and retrieves the message
    // Generates a message id and pushes that into the queue
    // After inserting  message, function returns message id

    return wonderQ.publishMessage(message);

}

export const fetchMessages = (cid, limit = 10) => {

    // Function pulls messages first 10 messages from the queue
    // Messages marked as processing
    // When processed infroms the queue and deletes the messages

    return wonderQ.recieveMessages(cid, limit);

}

export const deleteQueueMessage = (cid, mid) => {

    // delete for messages which are in processed and
    // whos timestamp is greater than 5 seconds
    // or delete messages with specific messageId
    wonderQ.deleteMessages(cid, mid)
}

export const unlockMessages = () => {
    setInterval(() => {

        // Job to unlock the messages if not processed within a
        // maximum processing time.

        wonderQ.unlockMessages()
    }, maxTime);
}
