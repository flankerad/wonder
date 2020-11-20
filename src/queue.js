/**
 * Messages of WonderQ are stored in Queue
 */
import { v4 as uuidv4 } from 'uuid';
import { Queue } from './data.js';
import { maxTime } from './config.js'

/**
 * WonderQ messaging queue
 * @class extends Queue
 */
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
    /**
     *
     * @param {number} cid consumer id
     * @param {number} limit max number of messages for consumer
     */
    recieveMessages(cid, limit) {

        let i = 0,
            returnMap = {};

        for (let message of this._messages) {

            if (message[1]._consumerId == '' && i < limit) {

                message[1]._consumerId = cid;
                message[1]._timestamp = Date.now();
                returnMap[message[0]] = message[1];
                i++;

            } else if(i == limit) {
                break;
            }
        }

        return returnMap;

    }
    /**
     * Delete processed message requested by Consumer
     *
     * @param {number} cid consumer id
     * @param {number} key pos of message in queue
     */
    deleteMessages(cid, key) {
        let message = this._messages.get(key)
        if (message._consumerId == cid) {
            this.dequeue(key)
            return true;
        }
        return false;
    }

    /**
     * Makes messages available after visiblity timeout
     * Self running function
     * When current time has exceed processing time
     * Remove consumer Id from unprocessed messages
     * making them available for other consumers to pick
     */
    unlockMessages() {

        let currTime = Date.now();
        for (let message  of this._messages) {

            let processingTime = message[1]._timestamp + maxTime;

            if (currTime > processingTime) {
                message[1]._consumerId = "";
            }
        }
    }
}

export const wonderQ = new WonderQ('wonder');

/**
 * Function parses request body and retrieves the message
 * Generates a message id and pushes that into the queue
 * After inserting  message, function returns message id
 * @param {object} message
 */

export const publishToQueue = (message) => {
    return wonderQ.publishMessage(message);
}

/**
 * Function pulls messages first 10 messages from the queue
 * Messages marked as processing
 * When processed infroms the queue and deletes the messages
 * @param {number} cid consumer id
 * @param {number} limit max number of messages for consumer
 */
export const fetchMessages = (cid, limit = 10) => {
    return wonderQ.recieveMessages(cid, limit);
}

/**
 * Delete messages with specific messageId
 * @param {number} cid consumer id
 * @param {number} mid message pos in the queue
 */
export const deleteQueueMessage = (cid, mid) => {
    return wonderQ.deleteMessages(cid, mid)
}

/**
 * Job to unlock the messages if not processed within a
 * maximum processing time.
 * Delete for messages which are in processed and
 * whos timestamp is greater than 5 seconds
 * @param {number} maxTime visiblity timeout or max processing time
 */
export const unlockMessages = () => {
    setInterval(() => {
        wonderQ.unlockMessages()
    }, maxTime);
}
