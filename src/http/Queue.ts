/**
 * The request queue manager.
 */
export class Queue {
	/**
	 * The list of requests to perform.
	 */
	private readonly promises: { promise: Promise<void>; resolve: () => void }[] = [];

	/**
	 * The number of requests in the queue.
	 */
	public get length(): number {
		return this.promises.length;
	}

	/**
	 * Wait for the resolution of first request in the queue.
	 */
	public wait(): Promise<void> {
		let resolve!: () => void;
		const promise = new Promise<void>(($resolve) => {
			resolve = $resolve;
		});

		this.promises.push({ promise, resolve });

		return this.promises.length > 1 ? this.promises[this.promises.length - 2].promise : Promise.resolve();
	}

	/**
	 * Resolve the first request in the queue.
	 */
	public shift(): void {
		this.promises.shift()?.resolve();
	}
}
