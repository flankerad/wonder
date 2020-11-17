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

    publishMessage(message) {
        message.messageId = uuidv4();
        message.timestamp = Date.now();
        this.insert(message);
        console.log(this._messages);
        return message.messageId;
    };

    recieveMessages(...args) {
        //Implements receive message for Q
    };

    getQueueName() {
        return this._name
    }
}

export const wonderQ = new WonderQ('wonder')


export const publishToQueue = (message) => {
    // Function parses request body and retrieves the message
    // Generates a message id and pushes that into the queue
    // After inserting  message, function returns message id
    wonderQ.publishMessage(message);
}

export const getMessagesFromQueue = () => {
    // Function pulls messages fro
}