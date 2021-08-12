import { ServerApi } from 'stellar-sdk';

import { StellarClient } from '../../../clients';
import { Trade } from '../../ressources/stellar/Trade';
import { BaseManager, isPatchable } from '../BaseManager';

export class TradeManager extends BaseManager<typeof Trade> {
	public constructor(public readonly stellar: StellarClient, iterable?: (ServerApi.TradeRecord | Trade)[]) {
		super(stellar.client, Trade, iterable);
	}

	/**
	 * Adds the trade to the cache (or return the cached trade, if `cache` is true).
	 *
	 * @param data - The trade to add.
	 * @param cache - If the trade should be cached (or cached trade patched), `true` by default.
	 * @returns The resolved trade.
	 */
	public add(data: ServerApi.TradeRecord, cache = true): Trade {
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
}
