export const hostname = "127.0.0.1"
export const port = "3000"
const baseUrl = "" //insert base url
const sendMessage = "q/producer" //queue the message for processing
const recieveMessage = "q/consumer" //pick a  message from queue
export let queueSize = 100 //size of the total messages in queues
export let messageProcessingTimeout = 5 //time in seconds

export const sendMessageUrl = baseUrl + sendMessage
export const recieveMessageUrl = baseUrl + recieveMessage
export const queueName = 'wonder'


