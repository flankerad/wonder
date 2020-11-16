/**
 * Messages of WonderQ are stored in Queue
 */

class Queue {
    constructor(...messages, size) {
        //Initialize the queue
        this._messages = [...messages];
        this._size = size;
    }

    insert(...args) { };

    delete(...args) { };

    getLength(...args) { };

    isfull(...args) { };

}