import { APIPayment, getPayment } from '@pinetwork-js/api-typing';

import { Client } from '../../../clients';
import { Payment } from '../../ressources';
import { BaseManager, isPatchable } from '../BaseManager';

export class PaymentManager extends BaseManager<typeof Payment> {
	public constructor(client: Client) {
		super(client, Payment);
	}

	/**
	 * Adds the payment to the cache (or return the cached payment, if `cache` is true).
	 *
	 * @param data - The payment to add.
	 * @param cache - If the payment should be cached (or cached payment patched), `true` by default.
	 * @returns The resolved payment.
	 */
	public add(data: APIPayment, cache = true): Payment {
		const existing = this.cache.get(data.identifier);

		if (existing) {
			if (cache && isPatchable(existing)) {
				existing.$patch(data);
			}

			return existing;
		}

		const entry = new this.hold(this.client, data);

		if (cache) {
			this.cache.set(entry.id, entry);
		}

		return entry;
	}

	/**
	 * Fetch the payment by its id in the cache or from the Pi Network Platform API.
	 *
	 * @param id - The payment id to fetch.
	 * @param cache - If the payment should be cached (or cached payment patched), `true` by default.
	 * @param checkCache - If the payment should be fetched in the cache, `true` by default.
	 * @returns - The fetched payment.
	 */
	public async fetch(id: string, cache?: boolean, checkCache = true): Promise<Payment> {
		const existing = checkCache && this.cache.get(id);

		if (existing) {
			return existing;
		}

		const payment = await this.client.http.request('get', getPayment({ paymentId: id }));

		return this.add(payment, cache);
	}
}
