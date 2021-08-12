import { EffectType, TrustlineSponsorshipCreated } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Asset } from '../Asset';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Trustline Sponsorship Created Effect.
 */
export class TrustlineSponsorshipCreatedEffect extends Effect<
	EffectTypeNames.trustlineSponsorshipCreated,
	EffectType.trustline_sponsorship_created
> {
	/**
	 * The asset of the trustline in the SEP-11 form `asset_code:issuing_address` or `native` (for Pi).
	 */
	public assetInfo!: string;

	/**
	 * The id of the new trustline sponsor.
	 */
	public sponsorId!: string;

	public constructor(client: Client, data: TrustlineSponsorshipCreated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: TrustlineSponsorshipCreated): void {
		super.$patch(data);

		this.assetInfo = data.asset;
		this.sponsorId = data.sponsor;
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
	 * Get the new sponsor of the account.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the sponsor account instead.
	 * @returns The account of the new sponsor.
	 */
	public getSponsorAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.sponsorId, true, !forceUpdate);
	}
}
