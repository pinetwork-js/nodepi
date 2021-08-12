import { EffectType, TrustlineAuthorizedToMaintainLiabilities } from 'stellar-sdk/lib/types/effects';
import { AssetType } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Asset } from '../Asset';
import { Account } from '../Account';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Trustline Authorized To Maintain Liabilities Effect.
 */
export class TrustlineAuthorizedToMaintainLiabilitiesEffect extends Effect<
	EffectTypeNames.trustlineAuthorizedToMaintainLiabilities,
	EffectType.trustline_authorized_to_maintain_liabilities
> {
	/**
	 * The type of the authorized asset. Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	public assetType!: AssetType;

	/**
	 * The code for the authorized asset. Appears if `assetType` is not native.
	 */
	public assetCode?: string;

	/**
	 * The id of the account being authorized to maintain liabilities.
	 */
	public trustorId!: string;

	public constructor(client: Client, data: TrustlineAuthorizedToMaintainLiabilities) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: TrustlineAuthorizedToMaintainLiabilities): void {
		super.$patch(data);

		this.assetType = data.asset_type;
		this.assetCode = data.asset_code;
		this.trustorId = data.trustor;
	}

	/**
	 * Get the authorized asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the asset instead.
	 * @returns The authorized asset if it's not `native`.
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
	 * @returns The account of the trustor.
	 */
	public getTrustorAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.trustorId, true, !forceUpdate);
	}
}
