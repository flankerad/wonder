import { sendMessage, recieveMessage } from './config.js';
import http from 'http';
import url from 'url';
import { Message } from './data.js';
import { publishToQueue, fetchMessages, deleteQueueMessage } from './queue.js';


/**
 * Handles API routes
 * Consumer API (GET)
 * Publish API (POST)
 * Delete API (DELETE
 */
export const server = http.createServer((request, response) => {

    const requestUrl = url.parse(request.url, true);

    response.statusCode = 200;
    response.setHeader('content-Type', 'Application/json');

    /**
     * Publish API (POST)
     * Publish the message and recieve the confirmation message id
     * call publish message from Q
     * Take out and parse message
     * @returns message id and acknowledgment response

     */
    if (requestUrl.pathname == sendMessage && request.method == 'POST') {
        let body = '';

        request.on('data', (chunk) => {
            body += chunk;
        });

        request.on('end', () => {
            let messageBody = JSON.parse(body)
            /**
             * @constructs Message in proper structure
             */
            let postMessage = new Message(messageBody.message)
            let messageId = publishToQueue(postMessage);

            let returnResponse = {
                "text": "Message Published to queue",
                "messageId": messageId
            }

            response.end(JSON.stringify(returnResponse));

        });
    }

    /**
     * Get consumer Id from params
     * consumer Id keeps track, if the message is under processing
     * and which consumer is processing.
     * Fetch messages (default limit = 10) from queue and return
     * @returns {object} returnResponse
     */
    else if (requestUrl.pathname == recieveMessage && request.method == 'GET') {
        let queryObj = JSON.parse(JSON.stringify(requestUrl.query));
        let returnResponse = fetchMessages(queryObj.cid, queryObj.limit);
        response.end(JSON.stringify(returnResponse));
    }

    /**
     * Get consumer Id & message pos from params
     * @param {number} id message pos key in the queue
     * @param {number} cid consumer id
     * @returns {text} true or false
     */
    else if (requestUrl.pathname == recieveMessage && request.method == 'DELETE') {
        let queryObj = JSON.parse(JSON.stringify(requestUrl.query));

        let returnResponse = deleteQueueMessage(queryObj.cid, +(queryObj.id))
        response.end(JSON.stringify(returnResponse));

    }
    /**
     * When wrong url is entered
     */
    else {
        let returnResponse = {
            "text": "Url endpoint or method does not exist.",
        }
        response.statusCode = 404;
        response.end(JSON.stringify(returnResponse));
    }

})