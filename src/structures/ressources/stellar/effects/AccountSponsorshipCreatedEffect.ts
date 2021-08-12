import { AccountSponsorshipCreated, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Account Sponsorship Created Effect.
 */
export class AccountSponsorshipCreatedEffect extends Effect<
	EffectTypeNames.accountSponsorshipCreated,
	EffectType.account_sponsorship_created
> {
	/**
	 * The id of the new account sponsor.
	 */
	public sponsorId!: string;

	public constructor(client: Client, data: AccountSponsorshipCreated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: AccountSponsorshipCreated): void {
		super.$patch(data);

		this.sponsorId = data.sponsor;
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
