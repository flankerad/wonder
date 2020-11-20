/**
 * A class managing queue
 * @class Message
 */
export class Message {
    constructor(message) {
        this._id = "";
        this._body = message;
        this._timestamp = Date.now();
        this._processed = false;
        this._consumerId = "";
    }
}

/**
 * A class managing queue
 * @class
 */
export class Queue {
    constructor(size) {
        //Initialize the queue
        this._messages = new Map();
        this._size = size;
        this._tail = 0
    };

    enqueue(data) {
        this._messages.set(this._tail, data);
        this._tail++;
    };

    dequeue(pos) {
        return this._messages.delete(pos);
    };

    getLength() {
        return this._messages.size
    };

    isFull() {
        return this._messages.size == this._size
    };

    isEmpty() {
        return this._messages.size == 0;
    }

}