import { hostname, port } from './config.js';
import server from './routes.js';


server.listen(port, hostname), () => {
    console.log(`Server running at http://${hostname}:${port}/`)
}

