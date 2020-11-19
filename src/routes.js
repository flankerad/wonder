import { sendMessage, recieveMessage } from './config.js';
import http from 'http';
import url from 'url';
import { Message } from './data.js';
import { publishToQueue, fetchMessages, deleteQueueMessage } from './queue.js';

export const server = http.createServer((request, response) => {

    //Recieve request from different routes here
    // let wonderQ = WonderQ()

    const requestUrl = url.parse(request.url, true);

    // Consumer API (GET)
    // Publish API (POST)
    // Delete API (DELETE)

    response.statusCode = 200;
    response.setHeader('content-Type', 'Application/json');

    if (requestUrl.pathname == sendMessage && request.method == 'POST') {

        // Publish the message and recieve the confirmation message id
        // Take out and parse message
        // call publish message from Q
        // return message id or other identifier as a acknowledgment response

        let body = '';

        request.on('data', (chunk) => {
            body += chunk;
        });

        request.on('end', () => {
            let messageBody = JSON.parse(body)

            let postMessage = new Message(messageBody.message)
            let messageId = publishToQueue(postMessage);

            let returnResponse = {
                "text": "Message Published to queue",
                "messageId": messageId
            }

            response.end(JSON.stringify(returnResponse));

        });
    }

    else if (requestUrl.pathname == recieveMessage && request.method == 'GET') {

        // Get consumer Id from params
        // consumer Id informs, where the message is under processing
        // and which consumer is processing. (one in our case)
        // Fetch messages (default limit = 10) from queue and return

        let queryObj = JSON.parse(JSON.stringify(requestUrl.query));

        let returnResponse = fetchMessages(queryObj.cid, queryObj.limit);
        response.end(JSON.stringify(returnResponse));
    }

    else if (requestUrl.pathname == recieveMessage && request.method == 'DELETE') {

        // Get consumer Id from params
        // consumer Id informs, where the message is under processing
        // and which consumer is processing. (one in our case)
        // Fetch messages (default limit = 10) from queue and return

        let queryObj = JSON.parse(JSON.stringify(requestUrl.query));

        let returnResponse = deleteQueueMessage(queryObj.cid, +(queryObj.id))
        response.end(JSON.stringify(returnResponse));

    }

    else {

        let returnResponse = {
            "text": "Url endpoint or method does not exist.",
        }
        response.statusCode = 404;
        response.end(JSON.stringify(returnResponse));
    }

})