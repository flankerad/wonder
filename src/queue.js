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
        message._messageId = uuidv4();
        this.enqueue(message);
        return message._messageId;
    };

    recieveMessages(consumerId, limit) {
        //Implements receive message for Q
        // Pull get messages from queue
        // set processing consumer Id

        let temp = []
        for (let i = 0; i < this._messages.length; i++) {

            if (this.isFull()) {
                break;
            }

            this._messages[i]._consumerId = consumerId;
            this._messages[i]._timestamp = Date.now();
            temp.push(this._messages[i]);

        }
        return temp;
    };

    deleteMessages(messageId, consumerId) {

        // Delete processed message requested by Consumer

        for (let i = 0; i < this.getLength(); i++) {

             if (this._messages[i]._messageId == messageId && this._messages[i]._consumerId == consumerId) {
                 this.dequeue(i, 1);

            }
        }
    }

    unlockMessages() {

        // When current time has exceed processing time
        // Remove consumer Id from unprocessed messages
        // making them available for other consumers to pick

        let currTime = Date.now();

        for (let i = 0; i < this.getLength(); i++) {

            let processingTime = this._messages[i]._timestamp + maxTime;

            if (currTime > processingTime &&
                this._messages[i]._processed == false) {

                this._messages._consumerId = "";
    }
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

    return wonderQ.recieveMessages(consumerId, limit);

}

export const deleteQueueMessage = (messageId) => {

    // delete for messages which are in processed and
    // whos timestamp is greater than 5 seconds
    // or delete messages with specific messageId
    wonderQ.deleteMessages(messageId)
}

export const unlockMessages = () => {
    setInterval(() => {

        // Job to unlock the messages if not processed within a
        // maximum processing time.

        wonderQ.unlockMessages()
    }, maxTime);
}
