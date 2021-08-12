import { EffectType, TrustlineSponsorshipUpdated } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Asset } from '../Asset';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Trustline Sponsorship Updated Effect.
 */
export class TrustlineSponsorshipUpdatedEffect extends Effect<
	EffectTypeNames.trustlineSponsorshipUpdated,
	EffectType.trustline_sponsorship_updated
> {
	/**
	 * The asset of the trustline in the SEP-11 form `asset_code:issuing_address` or `native` (for Pi).
	 */
	public assetInfo!: string;

	/**
	 * The id of the former trustline sponsor.
	 */
	public formerSponsorId!: string;

	/**
	 * The id of the new trustline sponsor.
	 */
	public newSponsorId!: string;

	public constructor(client: Client, data: TrustlineSponsorshipUpdated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: TrustlineSponsorshipUpdated): void {
		super.$patch(data);

		this.assetInfo = data.asset;
		this.formerSponsorId = data.former_sponsor;
		this.newSponsorId = data.new_sponsor;
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

	/**
	 * Get the new sponsor of the account.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the new sponsor account instead.
	 * @returns The account of the new sponsor.
	 */
	public getNewSponsorAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.newSponsorId, true, !forceUpdate);
	}
}
