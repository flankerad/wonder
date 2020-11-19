/**
 * Publisher publishes message to the queue
 */
import fetch from 'node-fetch';
import { cid, sendMessageUrl } from './config.js';

/**
 * Publish a message which may be fetched from a db or called from somewhere else with data

 */


export const publisher = (async () => {

	const body = { message: "Some message pushed from a list or DB" };
	const response = await fetch(sendMessageUrl, {
		method: 'post',
		body: JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' }
	});
	const json = await response.json();
	return json
});