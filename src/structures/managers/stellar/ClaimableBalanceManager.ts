import { ServerApi } from 'stellar-sdk';

import { StellarClient } from '../../../clients';
import { ClaimableBalance } from '../../ressources/stellar/ClaimableBalance';
import { BaseManager, isPatchable } from '../BaseManager';

export class ClaimableBalanceManager extends BaseManager<typeof ClaimableBalance> {
	public constructor(
		public readonly stellar: StellarClient,
		iterable?: (ServerApi.ClaimableBalanceRecord | ClaimableBalance)[],
	) {
		super(stellar.client, ClaimableBalance, iterable);
	}

	/**
	 * Adds the claimable balance to the cache (or return the cached claimable balance, if `cache` is true).
	 *
	 * @param data - The claimable balance to add.
	 * @param cache - If the claimable balance should be cached (or cached claimable balance patched), `true` by default.
	 * @returns The resolved claimable balance.
	 */
	public add(data: ServerApi.ClaimableBalanceRecord, cache = true): ClaimableBalance {
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
	 * Fetch the claimable balance by its id in the cache or from the Pi Network Stellar API.
	 *
	 * @param id - The claimable balance id to fetch.
	 * @param cache - If the claimable balance should be cached (or cached claimable balance patched), `true` by default.
	 * @param checkCache - If the claimable balance should be fetched in the cache, `true` by default.
	 * @returns The fetched claimable balance.
	 */
	public async fetch(id: string, cache?: boolean, checkCache = true): Promise<ClaimableBalance> {
		const existing = checkCache && this.cache.get(id);

		if (existing) {
			return existing;
		}

		const claimableBalance = await this.stellar.server.claimableBalances().claimableBalance(id).call();

		return this.add(claimableBalance, cache);
	}
}
