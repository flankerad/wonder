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

console.log("the id for consumer "+ consumerId)
export const consumer = async (id) => {
    try {
        console.log('This is consumer calling')
        var response = await fetch(recieveMessageUrl + "?consumerId=" + id);

        if (response.status > 201) {
            console.log(response.statusText);
            // try again after 1 second
            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            await consumer(id);
        } else {
            var messages = await response.json();
            console.log("Got messages from consumer" + messages);
            return messages
        }

    } catch (err) {
        console.log("Error occured while calling Consumer")
        console.log(err)
    }
}
consumer(consumerId)

