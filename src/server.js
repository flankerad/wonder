import { config } from 'process'

import { hostname, port } from './config.js';
import http from 'http';
import url from 'url';


const server = http.createServer((request, response) => {
    //server implementation goes here
    response.statusCode = 200;
});

server.listen(port, hostname), () => {
    console.log(`Server running at http://${hostname}:${port}/`)
}

