/**
 * Messages of WonderQ are stored in Queue
 */

import { Queue } from './data.js';


class WonderQ extends Queue {
    constructor(name) {
        super();
        this._name = name;
    }

    publishMessage(...args) {
        //Implements publish message for Q
    };

    recieveMessages(...args) {
        //Implements receive message for Q
    };

    getQueueName() {
        return this._name
    }
}

export const wonderQ = new WonderQ('wonder')
