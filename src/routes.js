import { sendMessageUrl, recieveMessageUrl } from './config.js';
import http from 'http';
import url from 'url';
import { Message } from './data.js';
import { publishToQueue, fetchMessages } from './queue.js';

export const server = http.createServer((request, response) => {
    //Recieve request from different routes here
    // let wonderQ = WonderQ()
    const requestUrl = url.parse(request.url, true);
    console.log(requestUrl)
    // Consumer API (GET)
    // Publish API (POST)

    if (requestUrl.pathname == '/publish' && request.method == 'POST') {

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

            let postMessage = new Message(messageBody)
            let messageId = publishToQueue(postMessage);

            let returnResponse = {
                "text": "Message Published to queue",
                "messageId": messageId
            }

            response.statusCode = 200;
            response.setHeader('content-Type', 'Application/json');
            response.end(JSON.stringify(returnResponse));

        });
    }

    else if (requestUrl.pathname == '/consume' && request.method == 'GET') {

        // Get consumer Id from params
        // consumer Id informs, where the message is under processing
        // and which consumer is processing. (one in our case)
        // Fetch messages (default limit = 10) from queue and return

        let consumerId = JSON.parse(JSON.stringify(requestUrl.query)).consumerId
        let returnResponse = fetchMessages(consumerId);

        response.statusCode = 200;
        response.setHeader('content-Type', 'Application/json');
        response.end(JSON.stringify(returnResponse));
    }

    else {
        let returnResponse = {
            "text": "Url endpint or method does not exist.",
        }

        response.statusCode = 404;
        response.setHeader('content-Type', 'Application/json');
        response.end(JSON.stringify(returnResponse));
    }
})