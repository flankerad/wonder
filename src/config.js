export const hostname = "127.0.0.1"
export const port = "3000"
const baseUrl = `http://${hostname}:${port}`
const sendMessage = "/publish" //queue the message for processing
const recieveMessage = "/consume" //pick a  message from queue
export let queueSize = 100 //size of the total messages in queues
export let messageProcessingTimeout = 5 //time in seconds

export const sendMessageUrl = baseUrl + sendMessage
export const recieveMessageUrl = baseUrl + recieveMessage
export const queueName = 'wonder'
export const cid = 1;

export const maxTime = 5 * 60 * 1000
export const maxTries = 5