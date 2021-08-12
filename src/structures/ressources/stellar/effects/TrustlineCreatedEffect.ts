import { EffectType, TrustlineCreated } from 'stellar-sdk/lib/types/effects';
import { AssetType } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Asset } from '../Asset';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Trustline Created Effect.
 */
export class TrustlineCreatedEffect extends Effect<EffectTypeNames.trustlineCreated, EffectType.trustline_created> {
	/**
	 * The type of the created asset. Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	public assetType!: AssetType;

	/**
	 * The code for the created asset. Appears if `assetType` is not native.
	 */
	public assetCode?: string;

	/**
	 * The Stellar address of the created asset’s issuer. Appears if `assetType` is not native.
	 */
	public assetIssuerId?: string;

	/**
	 * The maximum amount of the created asset.
	 */
	public limit!: number;

	public constructor(client: Client, data: TrustlineCreated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: TrustlineCreated): void {
		super.$patch(data);

		this.assetType = data.asset_type;
		this.assetCode = data.asset_code;
		this.assetIssuerId = data.asset_issuer;
		this.limit = Number(data.limit);
	}

	/**
	 * Get the created asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the asset instead.
	 * @returns The created asset if it's not `native`.
	 */
	public async getAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.assetType === 'native') {
			return;
		}

		const assetId = `${this.assetCode}:${this.assetIssuerId}`;

		return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
	}
}
