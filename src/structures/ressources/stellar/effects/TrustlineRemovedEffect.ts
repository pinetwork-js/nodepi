import { EffectType, TrustlineRemoved } from 'stellar-sdk/lib/types/effects';
import { AssetType } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Trustline Removed Effect.
 */
export class TrustlineRemovedEffect extends Effect<EffectTypeNames.trustlineRemoved, EffectType.trustline_removed> {
	/**
	 * The type of the removed asset. Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	public assetType!: AssetType;

	/**
	 * The code for the removed asset. Appears if `assetType` is not native.
	 */
	public assetCode?: string;

	/**
	 * The Stellar address of the removed asset’s issuer. Appears if `assetType` is not native.
	 */
	public assetIssuerId?: string;

	/**
	 * The maximum amount of the removed asset.
	 */
	public limit!: number;

	public constructor(client: Client, data: TrustlineRemoved) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: TrustlineRemoved): void {
		super.$patch(data);

		this.assetType = data.asset_type;
		this.assetCode = data.asset_code;
		this.assetIssuerId = data.asset_issuer;
		this.limit = Number(data.limit);
	}
}
