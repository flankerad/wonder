import { sendMessageUrl, recieveMessageUrl } from './config.js';
import http from 'http';
import url from 'url';
import { Message } from './data.js';
import { publishToQueue, fetchMessages } from './queue.js';

export const server = http.createServer((request, response) => {
    //Recieve request from different routes here

    // let wonderQ = WonderQ()
    const requestUrl = url.parse(request.url)
    console.log(requestUrl)
    // Consumer API (GET)
    // Publish API (POST)

    if (requestUrl.pathname == '/publish' && request.method == 'POST') {
        // Publish the message and recieve the confirmation message id
        // Take out and parse message
        // call publish message from Q
        // return message id or other identifier as a acknowledgment response\
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
        console.log('Consume Message')
        // Get consumer Id from params
        // consumer Id informs, where the message is under processing
        // and which consumer is processing. (one in our case)
        // Fetch messages (default limit = 10) from queue and return
        const consumerId = requestUrl.query.consumerId
        console.log(consumerId);
        let messages = fetchMessages(consumerId);
        return messages;
    }

    else {
        console.log('Url endpint or method does not exist.')
    }
})