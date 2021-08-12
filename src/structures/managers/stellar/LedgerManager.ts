import { ServerApi } from 'stellar-sdk';

import { StellarClient } from '../../../clients';
import { Ledger } from '../../ressources/stellar/Ledger';
import { BaseManager, isPatchable } from '../BaseManager';

export class LedgerManager extends BaseManager<typeof Ledger> {
	public constructor(public readonly stellar: StellarClient, iterable?: (ServerApi.LedgerRecord | Ledger)[]) {
		super(stellar.client, Ledger, iterable);
	}

	/**
	 * Adds the ledger to the cache (or return the cached ledger, if `cache` is true).
	 *
	 * @param data - The ledger to add.
	 * @param cache - If the ledger should be cached (or cached ledger patched), `true` by default.
	 * @returns The resolved ledger.
	 */
	public add(data: ServerApi.LedgerRecord, cache = true): Ledger {
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
	 * Fetch the ledger by its id in the cache or from the Pi Network Stellar API.
	 *
	 * @param id - The ledger id to fetch.
	 * @param cache - If the ledger should be cached (or cached ledger patched), `true` by default.
	 * @param checkCache - If the ledger should be fetched in the cache, `true` by default.
	 * @returns The fetched ledger.
	 */
	public async fetch(id: string | number, cache?: boolean, checkCache = true): Promise<Ledger> {
		const existing = checkCache && this.cache.get(String(id));

		if (existing) {
			return existing;
		}

		const ledger = (await this.stellar.server.ledgers().ledger(id).call()) as unknown as ServerApi.LedgerRecord;

		return this.add(ledger, cache);
	}
}
