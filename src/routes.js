import { sendMessageUrl, recieveMessageUrl } from './config.js';
import http from 'http';
import url from 'url';
import { wonderQ } from './queue.js';

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
        body = '';

        request.on('data', (chunk) => {
            body += chunk;
        });

        request.on('end', () => {
            postMessage = JSON.parse(body)


            messageId = publishToQueue(postMessage);

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
        // Consume messages and send confirmation to the queue
        wonderQ.consumeMessage(request, response)
    }

    else {
        console.log('Url endpint or method does not exist.')
    }
})