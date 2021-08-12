import { EffectType, TrustlineUpdated } from 'stellar-sdk/lib/types/effects';
import { AssetType } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Asset } from '../Asset';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Trustline Updated Effect.
 */
export class TrustlineUpdatedEffect extends Effect<EffectTypeNames.trustlineUpdated, EffectType.trustline_updated> {
	/**
	 * The type of the updated asset. Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	public assetType!: AssetType;

	/**
	 * The code for the updated asset. Appears if `assetType` is not native.
	 */
	public assetCode?: string;

	/**
	 * The Stellar address of the updated asset’s issuer. Appears if `assetType` is not native.
	 */
	public assetIssuerId?: string;

	/**
	 * The maximum amount of the updated asset.
	 */
	public limit!: number;

	public constructor(client: Client, data: TrustlineUpdated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: TrustlineUpdated): void {
		super.$patch(data);

		this.assetType = data.asset_type;
		this.assetCode = data.asset_code;
		this.assetIssuerId = data.asset_issuer;
		this.limit = Number(data.limit);
	}

	/**
	 * Get the updated asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the asset instead.
	 * @returns The updated asset if it's not `native`.
	 */
	public async getAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.assetType === 'native') {
			return;
		}

		const assetId = `${this.assetCode}:${this.assetIssuerId}`;

		return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
	}
}
