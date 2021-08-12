import { AccountSponsorshipUpdated, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Account Sponsorship Updated Effect.
 */
export class AccountSponsorshipUpdatedEffect extends Effect<
	EffectTypeNames.accountSponsorshipUpdated,
	EffectType.account_sponsorship_updated
> {
	/**
	 * The id of the former account sponsor.
	 */
	public formerSponsorId!: string;

	/**
	 * The id of the new account sponsor.
	 */
	public newSponsorId!: string;

	public constructor(client: Client, data: AccountSponsorshipUpdated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: AccountSponsorshipUpdated): void {
		super.$patch(data);

		this.formerSponsorId = data.former_sponsor;
		this.newSponsorId = data.new_sponsor;
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
