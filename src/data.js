// Message to be sent from publisher
export class Message {
    constructor(message) {
        this._body = message;
        this._timestamp = Date.now();
        this._processed = false;
        this._consumerId = "";
    }
}


export class Queue {
    constructor(size) {
        //Initialize the queue
        this._messages = [];
        this._size = size;
    };

    insert(...args) {
        return this._messages.push(...args)
    };

    delete(...args) {
        return this._messages.pop(...args)
    };

    getLength() {
        return this._messages.length
    };

    isFull() {
        return this._messages.length == this._size
    };

    isEmpty() {
        return this._messages.length == 0;
    }

}