import { AccountFlagsUpdated, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Account Flags Updated Effect.
 */
export class AccountFlagsUpdatedEffect extends Effect<
	EffectTypeNames.accountFlagsUpdated,
	EffectType.account_flags_updated
> {
	/**
	 * If set to `true`, anyone who wants to hold an asset issued by the account must first be approved by the account.
	 */
	public authRequiredFlag!: boolean;

	/**
	 * If set to `true`, the account can freeze the balance of a holder of an asset issued by the account.
	 */
	public authRevokableFlag!: boolean;

	public constructor(client: Client, data: AccountFlagsUpdated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: AccountFlagsUpdated): void {
		super.$patch(data);

		this.authRequiredFlag = data.auth_required_flag;
		this.authRevokableFlag = data.auth_revokable_flag;
	}
}
