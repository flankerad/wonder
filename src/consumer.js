/**
 *
 * Consumer picks up message from the queues
 */
import fetch from 'node-fetch';
import { recieveMessageUrl } from './config.js';
import { cid } from './config.js';
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
        var response = await fetch(recieveMessageUrl + "?cid=" + id);

        if (response.status == 502) {
            // connection timeout
            // reconnect

            await consumer(id);

          } else if (response.status != 200) {
            // An error - let's show it
            console.log(response.statusText);
            // Reconnect in one second
            await new Promise(resolve => setTimeout(resolve, 5000));
            await consumer(id);

        } else {

            let messages = await response.json();

            console.log("Consumer Message", messages);

            // Go through messages and
            // process them at random time
            let min = 1,
                max = 10,
                rand = Math.floor(Math.random() * (max - min + 1) + min);

            for (let key in messages)  {

                processMessage(messages[key], rand)
                deleteMessageFromQueue(key);

            }

            // Call subscribe() again to get the next message
            await consumer(id);
          }

    } catch (err) {
        console.log("Error occured while calling Consumer")
        console.log(err)
    }
}
consumer(cid)



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

const deleteMessageFromQueue = async(id) => {
    //Deletes processed messages from queue

    const url = `${recieveMessageUrl}?cid=${cid}&id=${id}`;

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