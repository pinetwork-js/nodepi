import { AccountCreated, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Account Created Effect.
 */
export class AccountCreatedEffect extends Effect<EffectTypeNames.accountCreated, EffectType.account_created> {
	/**
	 * The amount of Pi sent to the created account.
	 */
	public startingBalance!: number;

	public constructor(client: Client, data: AccountCreated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: AccountCreated): void {
		super.$patch(data);

		this.startingBalance = Number(data.starting_balance);
	}
}
