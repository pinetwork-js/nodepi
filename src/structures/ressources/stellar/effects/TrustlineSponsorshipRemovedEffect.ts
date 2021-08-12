import { EffectType, TrustlineSponsorshipRemoved } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Asset } from '../Asset';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Trustline Sponsorship Removed Effect.
 */
export class TrustlineSponsorshipRemovedEffect extends Effect<
	EffectTypeNames.trustlineSponsorshipRemoved,
	EffectType.trustline_sponsorship_removed
> {
	/**
	 * The asset of the trustline in the SEP-11 form `asset_code:issuing_address` or `native` (for Pi).
	 */
	public assetInfo!: string;

	/**
	 * The id of the former trustline sponsor.
	 */
	public formerSponsorId!: string;

	public constructor(client: Client, data: TrustlineSponsorshipRemoved) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: TrustlineSponsorshipRemoved): void {
		super.$patch(data);

		this.assetInfo = data.asset;
		this.formerSponsorId = data.former_sponsor;
	}

	/**
	 * Get the asset of the trustline if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the asset instead.
	 * @returns The asset of the trustline if it's not `native`.
	 */
	public async getAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.assetInfo === 'native') {
			return;
		}

		return this.client.stellar.assets.fetch(this.assetInfo, true, !forceUpdate);
	}

	/**
	 * Get the former sponsor of the account.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the former sponsor account instead.
	 * @returns The account of the former sponsor.
	 */
	public getFormerSponsorAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.formerSponsorId, true, !forceUpdate);
	}
}
