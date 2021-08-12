import { ServerApi } from 'stellar-sdk';

import { StellarClient } from '../../../clients';
import { Asset } from '../../ressources/stellar/Asset';
import { BaseManager, isPatchable } from '../BaseManager';

export class AssetManager extends BaseManager<typeof Asset> {
	public constructor(public readonly stellar: StellarClient, iterable?: (ServerApi.AssetRecord | Asset)[]) {
		super(stellar.client, Asset, iterable);
	}

	/**
	 * Adds the asset to the cache (or return the cached asset, if `cache` is true).
	 *
	 * @param data - The asset to add.
	 * @param cache - If the asset should be cached (or cached asset patched), `true` by default.
	 * @returns The resolved asset.
	 */
	public add(data: ServerApi.AssetRecord, cache = true): Asset {
		const assetId = `${data.asset_code}:${data.asset_issuer}`;
		const existing = this.cache.get(assetId);

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
	 * Fetch the asset by its code in the cache or from the Pi Network Stellar API.
	 *
	 * @param id - The asset id to fetch.
	 * @param cache - If the asset should be cached (or cached asset patched), `true` by default.
	 * @param checkCache - If the asset should be fetched in the cache, `true` by default.
	 * @returns The fetched asset.
	 */
	public async fetch(id: string, cache?: boolean, checkCache = true): Promise<Asset> {
		const existing = checkCache && this.cache.get(id);

		if (existing) {
			return existing;
		}

		const [assetCode, assetIssuerId] = id.split(':');
		const asset = (await this.stellar.server.assets().forCode(assetCode).forIssuer(assetIssuerId).call()).records[0];

		return this.add(asset, cache);
	}
}
