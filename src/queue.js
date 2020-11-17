/**
 * Messages of WonderQ are stored in Queue
 */
import { v4 as uuidv4 } from 'uuid';
import { Queue } from './data.js';


class WonderQ extends Queue {
    constructor(name) {
        super(100);
        this._name = name;
    }

    getQueueName() {
        return this._name
    }

    publishMessage(message) {
        message._messageId = uuidv4();
        this.insert(message);
        return message.messageId;
    };

    recieveMessages(consumerId, limit) {
        //Implements receive message for Q

        let temp = []
        for (let i = 0; i < this._messages.length; i++) {

            this._messages[i]._consumerId = consumerId;
            this._messages[i]._timestamp = Date.now();
            temp.push(this._messages[i]);

        }
        return temp;
        // return this._messsages.slice(0, 10);
    };

    deleteMessages(message) {
        // this._messages.splice(0, 10);
    }
}

const cleanup = () => {
    // Job to unlock the messages if not processed within a
    // certain time.
}
export const wonderQ = new WonderQ('wonder')


export const publishToQueue = (message) => {

    // Function parses request body and retrieves the message
    // Generates a message id and pushes that into the queue
    // After inserting  message, function returns message id

    return wonderQ.publishMessage(message);
}

export const fetchMessages = (consumerId, limit = 10) => {

    // Function pulls messages first 10 messages from the queue
    // Messages marked as processing
    // When processed infroms the queue and deletes the messages

    let messages = wonderQ.recieveMessages(consumerId, limit);
    return messages
}