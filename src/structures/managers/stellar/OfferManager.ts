import { ServerApi } from 'stellar-sdk';

import { StellarClient } from '../../../clients';
import { Offer } from '../../ressources/stellar/Offer';
import { BaseManager, isPatchable } from '../BaseManager';

export class OfferManager extends BaseManager<typeof Offer> {
	public constructor(public readonly stellar: StellarClient, iterable?: (ServerApi.OfferRecord | Offer)[]) {
		super(stellar.client, Offer, iterable);
	}

	/**
	 * Adds the offer to the cache (or return the cached offer, if `cache` is true).
	 *
	 * @param data - The offer to add.
	 * @param cache - If the offer should be cached (or cached offer patched), `true` by default.
	 * @returns The resolved offer.
	 */
	public add(data: ServerApi.OfferRecord, cache = true): Offer {
		const existing = this.cache.get(String(data.id));

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
	 * Fetch the offer by its id in the cache or from the Pi Network Stellar API.
	 *
	 * @param id - The offer id to fetch.
	 * @param cache - If the offer should be cached (or cached offer patched), `true` by default.
	 * @param checkCache - If the offer should be fetched in the cache, `true` by default.
	 * @returns The fetched offer.
	 */
	public async fetch(id: string, cache?: boolean, checkCache = true): Promise<Offer> {
		const existing = checkCache && this.cache.get(id);

		if (existing) {
			return existing;
		}

		const offer = await this.stellar.server.offers().offer(id).call();

		return this.add(offer, cache);
	}
}
