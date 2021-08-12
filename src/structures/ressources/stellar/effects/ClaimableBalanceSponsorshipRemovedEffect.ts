import { ClaimableBalanceSponsorshipRemoved, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { ClaimableBalance } from '../ClaimableBalance';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Claimable Balance Sponsorship Removed Effect.
 */
export class ClaimableBalanceSponsorshipRemovedEffect extends Effect<
	EffectTypeNames.claimableBalanceSponsorshipRemoved,
	EffectType.claimable_balance_sponsorship_removed
> {
	/**
	 * The id of the claimable balance.
	 */
	public balanceId!: string;

	/**
	 * The id of the former claimable balance sponsor.
	 */
	public formerSponsorId!: string;

	public constructor(client: Client, data: ClaimableBalanceSponsorshipRemoved) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ClaimableBalanceSponsorshipRemoved): void {
		super.$patch(data);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.balanceId = (data as any).balance_id;
		this.formerSponsorId = data.former_sponsor;
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
	 * Get the former sponsor of the account.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the former sponsor account instead.
	 * @returns The account of the former sponsor.
	 */
	public getFormerSponsorAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.formerSponsorId, true, !forceUpdate);
	}
}
