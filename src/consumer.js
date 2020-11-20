/**
 *
 * Consumer picks up message from the queues
 */
import fetch from 'node-fetch';
import { recieveMessageUrl } from './config.js';
import { cid, maxTries } from './config.js';
import { publishToQueue, fetchMessages } from './queue.js';
import { Message } from './data.js';
import { async } from 'rsvp';

/**
 * Consumer function
 * Fetches messages from queue
 * Processes them and mark them as processed
 * Initiates delete for the messages that have been processed
 * If no messages are present waits for the messages to arrive
 * Till max tries are not reached
 * @param {number} id Unique id of consumer
 *
 */
let tries = 0;

export const consumer = async (id) => {

    try {
        var response = await fetch(recieveMessageUrl + "?cid=" + id);

        if (tries < maxTries) {
            if (response.status == 502) {
                // connection timeout
                // reconnect

                await consumer(id);

            } else if (response.status != 200) {
                // Error, Reconnect in one second

                await new Promise(resolve => setTimeout(resolve, 1000));
                await consumer(id);

            } else {

                let messages = await response.json();

                // Go through messages and
                // process them at random time

                // for (let key in messages) {
                //     message[key].processed = true;
                //     await processMessage(messages[key], rand)
                //     await deleteMessageFromQueue(key);
                // }

                // Call consumer() again to get the next message
                // await consumer(id);

                return messages // Return messages for e2e test

            }
            tries++;

        } else {

            return `Reached maxTries $(response.status)`
        }

    } catch (err) {
        console.log("Error occured while calling Consumer")
        console.log(err)
        throw err
    }
}
// consumer(cid)


/**
 * Mocks processing a message in random time
 * @param {object} message
 */
const processMessage = async(message) => {

    let processingTime = Math.floor(Math.random() * 9);
    setTimeout(() => {
        message._processed = true;
        return message
    }, processingTime * 1000)

}

/**
 * This function deletes messages from queue
 * When messages are processed successfully
 * Deletes processed messages from queue
 * @param {number} id Id is the key of message in the queue
 * @returns {string} true or false
 */
export const deleteMessageFromQueue = async (id) => {
    const url = `${recieveMessageUrl}?cid=${cid}&id=${id}`;
    try {
        const response = await fetch(url, { method: 'DELETE'});
        const isDeleted = await response.text();
        return isDeleted;
    } catch (err) {
        console.log("Error occured while calling Delete Message")
        console.log(err)
        return err
    }
}