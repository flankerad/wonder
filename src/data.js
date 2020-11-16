// Message to be sent from publisher
export default class Message {
    constructor(message, id) {
        this._body = message;
        this._timestamp = Date.now()
        this._messageId = id
    }
}

