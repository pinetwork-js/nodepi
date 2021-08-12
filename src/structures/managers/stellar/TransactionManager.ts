import { ServerApi } from 'stellar-sdk';

import { StellarClient } from '../../../clients';
import { Transaction } from '../../ressources/stellar/Transaction';
import { BaseManager, isPatchable } from '../BaseManager';

export class TransactionManager extends BaseManager<typeof Transaction> {
	public constructor(public readonly stellar: StellarClient, iterable?: (ServerApi.TransactionRecord | Transaction)[]) {
		super(stellar.client, Transaction, iterable);
	}

	/**
	 * Adds the transaction to the cache (or return the cached transaction, if `cache` is true).
	 *
	 * @param data - The transaction to add.
	 * @param cache - If the transaction should be cached (or cached transaction patched), `true` by default.
	 * @returns The resolved transaction.
	 */
	public add(data: ServerApi.TransactionRecord, cache = true): Transaction {
		const existing = this.cache.get(data.id);

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
	 * Fetch the transaction by its id in the cache or from the Pi Network Stellar API.
	 *
	 * @param id - The transaction id to fetch.
	 * @param cache - If the transaction should be cached (or cached transaction patched), `true` by default.
	 * @param checkCache - If the transaction should be fetched in the cache, `true` by default.
	 * @returns The fetched transaction.
	 */
	public async fetch(id: string, cache?: boolean, checkCache = true): Promise<Transaction> {
		const existing = checkCache && this.cache.get(id);

		if (existing) {
			return existing;
		}

		const transaction = await this.stellar.server.transactions().transaction(id).call();

		return this.add(transaction, cache);
	}
}
