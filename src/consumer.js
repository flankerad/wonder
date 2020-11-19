/**
 *
 * Consumer picks up message from the queues
 */
import fetch from 'node-fetch';
import { recieveMessageUrl } from './config.js';
import { cid, maxTries } from './config.js';
import { publishToQueue, fetchMessages } from './queue.js';
import { Message } from './data.js';

/**
 * Consumer function
 * Fetches messages from queue
 * Processes them and mark them as processed
 * Initiates delete for the messages that have been processed
 * If no messages are present waits for the messages to arrive
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
                // let min = 1,
                //     max = 10,
                //     rand = Math.floor(Math.random() * (max - min + 1) + min);

                // for (let key in messages) {
                //     message[key].processed = true;
                //     await processMessage(messages[key], rand)
                //     await deleteMessageFromQueue(key);
                //     // return
                // }

                // Call consumer() again to get the next message
                // await consumer(id);

                return messages // Return messages

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



const processMessage = (message, processingTime) => {

    // Mock processing a message
    // Complete processing in a random time

    setTimeout(() => {
        message._processed = true;
        return message
    }, processingTime * 1000)

}

export const deleteMessageFromQueue = async (id) => {

    //Deletes processed messages from queue

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