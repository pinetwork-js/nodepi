import { OptionsOfUnknownResponseBody, TimeoutError } from 'got';

import { Queue } from './Queue';
import { HttpManager } from './HttpManager';

/**
 * The http request handler.
 */
export class RequestHandler {
	/**
	 * The request queue.
	 */
	private readonly queue = new Queue();

	public constructor(private readonly manager: HttpManager) {}

	/**
	 * Push the request to the queue waiting for its execution.
	 *
	 * @param gotOptions - The got options for the request.
	 * @returns The payload of the request if there is one.
	 */
	public async push(gotOptions: OptionsOfUnknownResponseBody): Promise<Record<PropertyKey, unknown> | undefined> {
		await this.queue.wait();

		try {
			return this.execute(gotOptions);
		} finally {
			this.queue.shift();
		}
	}

	/**
	 * Execute the request.
	 *
	 * @param gotOptions - The got options for the request.
	 * @param retries - The number of retries performed.
	 * @returns The payload of the request if there is one.
	 */
	private async execute(
		gotOptions: OptionsOfUnknownResponseBody,
		retries = 0,
	): Promise<Record<PropertyKey, unknown> | undefined> {
		try {
			const response = await this.manager.gotClient(gotOptions);

			if (response.headers['content-type']?.startsWith('application/json')) {
				return JSON.parse(response.rawBody.toString());
			}
		} catch (error) {
			if (retries < this.manager.options.retryLimit && error instanceof TimeoutError) {
				return this.execute(gotOptions, retries + 1);
			}

			throw error;
		}
	}
}
