import { ClaimableBalanceSponsorshipCreated, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { ClaimableBalance } from '../ClaimableBalance';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Claimable Balance Sponsorship Created Effect.
 */
export class ClaimableBalanceSponsorshipCreatedEffect extends Effect<
	EffectTypeNames.claimableBalanceSponsorshipCreated,
	EffectType.claimable_balance_sponsorship_created
> {
	/**
	 * The id of the claimable balance.
	 */
	public balanceId!: string;

	/**
	 * The id of the new claimable balance sponsor.
	 */
	public sponsorId!: string;

	public constructor(client: Client, data: ClaimableBalanceSponsorshipCreated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ClaimableBalanceSponsorshipCreated): void {
		super.$patch(data);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.balanceId = (data as any).balance_id;
		this.sponsorId = data.sponsor;
	}

	/**
	 * Get the claimable balance.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the claimable balance instead.
	 * @returns The claimable balance.
	 */
	public getClaimableBalance(forceUpdate = false): Promise<ClaimableBalance> {
		return this.client.stellar.claimableBalances.fetch(this.balanceId, true, !forceUpdate);
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
