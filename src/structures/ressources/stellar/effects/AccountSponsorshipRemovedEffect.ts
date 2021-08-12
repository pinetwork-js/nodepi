import { AccountSponsorshipRemoved, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Account Sponsorship Removed Effect.
 */
export class AccountSponsorshipRemovedEffect extends Effect<
	EffectTypeNames.accountSponsorshipRemoved,
	EffectType.account_sponsorship_removed
> {
	/**
	 * The id of the former account sponsor.
	 */
	public formerSponsorId!: string;

	public constructor(client: Client, data: AccountSponsorshipRemoved) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: AccountSponsorshipRemoved): void {
		super.$patch(data);

		this.formerSponsorId = data.former_sponsor;
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
