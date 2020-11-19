/**
 *
 * Consumer picks up message from the queues
 */
import fetch from 'node-fetch';
import { recieveMessageUrl } from './config.js';
import { consumerId } from './config.js';
import { publishToQueue, fetchMessages } from './queue.js';
import { Message } from './data.js';

/**
 * Consumer function
 * Fetches messages from queue
 * Processes them and mark them as processed
 * Initiates delete for the messages that have been processed
 * If no messages are present waits for the messages to arrive
 */

export const consumer = async (id) => {
    try {
        var response = await fetch(recieveMessageUrl + "?consumerId=" + id);

        if (response.status > 201) {
            // try again after 1 second
            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            await consumer(id);
        } else {
            var messages = await response.json();

            // Go through messages and
            // process them at random time
            let min = 1,
                max = 10;
            for (let i = 0; i < messages.length; i++)  {

                let rand = Math.floor(Math.random() * (max - min + 1) + min);
                let processedMessage = processMessage(messages[i], rand)
                deleteMessageFromQueue(processedMessage._id);

            }
            await consumer(consumerId);
        }

    } catch (err) {
        console.log("Error occured while calling Consumer")
        console.log(err)
    }
}
consumer(consumerId)



const processMessage = (message, processingTime) => {
    // Mock processing a message
    // Complete processing in a random time

    setTimeout(() => {
        message._processed = true;
        console.log('Processing in ' + processingTime + ' seconds');
        console.log('Message ID ' + message._id);
        return message
    }, rand * 1000)

}

const deleteMessageFromQueue = async(messageId) => {
    //Deletes processed messages from queue
    const body = {
        'messageId': messageId,
        'consumerId': consumerId
    }
    const url = `${recieveMessageUrl}?consumerId=${consumerId}&messageId=${messageId}`
        recieveMessageUrl + "?consumerId=" + id
    try {
        const response = await fetch(url, { method: 'DELETE'});
        const json = await response.json();
        console.log("Message Deleted")
        console.log(json);

    } catch (err) {
        console.log("Error occured while calling Consumer")
        console.log(err)
    }



}