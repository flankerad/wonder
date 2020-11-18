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
            var jsonResponse = await response.json();
            return jsonResponse;
        }

    } catch (err) {
        console.log("Error occured while calling Consumer")
        console.log(err)
    }
}
consumer(consumerId)

