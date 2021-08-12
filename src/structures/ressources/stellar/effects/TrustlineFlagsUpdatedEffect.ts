import { AssetType } from 'stellar-sdk';
import { BaseEffectRecord, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Asset } from '../Asset';
import { Account } from '../Account';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

export interface TrustlineFlagsUpdated extends BaseEffectRecord {
	type_i: EffectType.trustline_flags_updated;
	asset_type: AssetType;
	asset_code?: string;
	asset_issuer?: string;
	trustor: string;
	authorized_flag?: boolean;
	authorized_to_maintain_liabilites_flag?: boolean;
}

/**
 * Structure representing a Stellar Trustline Flags Updated Effect.
 */
export class TrustlineFlagsUpdatedEffect extends Effect<
	EffectTypeNames.trustlineFlagsUpdated,
	EffectType.trustline_flags_updated
> {
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
	 * The id of the account being authorized.
	 */
	public trustorId!: string;

	/**
	 * If set to `true`, the trustor has been authorized to perform transactions with its credit.
	 */
	public authorizedFlag?: boolean;

	/**
	 * If set to `true`, the trustor has been authorized to maintain and reduce liabilities for its credit.
	 */
	public authorizedToMaintainLiabilitesFlag?: boolean;

	public constructor(client: Client, data: TrustlineFlagsUpdated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: TrustlineFlagsUpdated): void {
		super.$patch(data);

		this.assetType = data.asset_type;
		this.assetCode = data.asset_code;
		this.assetIssuerId = data.asset_issuer;
		this.trustorId = data.trustor;
		this.authorizedFlag = data.authorized_flag;
		this.authorizedToMaintainLiabilitesFlag = data.authorized_to_maintain_liabilites_flag;
	}

	/**
	 * Get the asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the asset instead.
	 * @returns The asset if it's not `native`.
	 */
	public async getAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.assetType === 'native') {
			return;
		}

		const assetId = `${this.assetCode}:${this.accountId}`;

		return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
	}

	/**
	 * Get the account of the trustor.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the trustor account instead.
	 */
	public getTrustorAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.trustorId, true, !forceUpdate);
	}
}
