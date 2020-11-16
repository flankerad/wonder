// Message to be sent from publisher
export class Message {
    constructor(message) {
        this._body = message;
        this._timestamp = Date.now();
        this._messageId = "";
        this._status = false;
        this._processing = false;
    }
}


export class Queue {
    // constructor(size) {
    //     //Initialize the queue
    //     this._messages = [...Array(size)];
    //     this._size = size;
    // };

    insert(...args) {
        return this._messages.push(...args)
    };

    delete(...args) {
        return this._messages.pop(...args)
    };

    getLength(...args) {
        return this._messages.length
    };

    isfull(...args) {
        return this._messages.length == this._size
    };

}