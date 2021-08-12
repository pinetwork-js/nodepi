import { AccountDebited, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Account Debited Effect.
 */
export class AccountDebitedEffect extends Effect<EffectTypeNames.accountDebited, EffectType.account_debited> {
	/**
	 * The amount of Pi debited from the account.
	 */
	public amount!: number;

	public constructor(client: Client, data: AccountDebited) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: AccountDebited): void {
		super.$patch(data);

		this.amount = Number(data.amount);
	}
}
