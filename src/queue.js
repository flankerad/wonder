/**
 * Messages of WonderQ are stored in Queue
 */
import { v4 as uuidv4 } from 'uuid';
import { Queue } from './data.js';


class WonderQ extends Queue {
    constructor(name) {
        super();
        this._name = name;
    }

    publishMessage(message) {
        message.messageId = uuidv4();
        message.timestamp = new Date.now();
        this.insert(message)
        return message.messageId
    };

    recieveMessages(...args) {
        //Implements receive message for Q
    };

    getQueueName() {
        return this._name
    }
}

export const wonderQ = new WonderQ('wonder')


const publishToQueue = (message) => {
    // Function parses request body and retrieves the message
    // Generates a message id and pushes that into the queue
    // After inserting  message, function returns message id

}

const getMessagesFromQueue = () => {
    // Function pulls messages fro
}