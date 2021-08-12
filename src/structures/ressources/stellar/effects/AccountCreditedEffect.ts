import { AccountCredited, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Account Credited Effect.
 */
export class AccountCreditedEffect extends Effect<EffectTypeNames.accountCredited, EffectType.account_credited> {
	/**
	 * The amount of Pi credited to the account.
	 */
	public amount!: number;

	public constructor(client: Client, data: AccountCredited) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: AccountCredited): void {
		super.$patch(data);

		this.amount = Number(data.amount);
	}
}
