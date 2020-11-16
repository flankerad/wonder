import { sendMessageUrl, recieveMessageUrl } from './config.js';
import http from 'http';
import url from 'url';
import { wonderQ } from './queue.js';

export default server = http.createServer((request, response) => {
    //Recieve request from different routes here

    // let wonderQ = WonderQ()
    const requestUrl = url.parse(request.url)

    // Consumer API (GET)
    // Publish API (POST)

    if (requestUrl.pathname == '/publish' && request.method == 'POST') {
        console.log('Publish Message')
        // Publish the message and recieve the confirmation message id
    }

    else if (requestUrl.pathname == '/consume' && request.method == 'GET') {
        console.log('Consume Message')
        // Consume messages and send confirmation to the queue
    }

    else {
        console.log('Url endpint or method does not exist')
    }
})