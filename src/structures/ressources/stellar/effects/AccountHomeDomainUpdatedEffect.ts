import { AccountHomeDomainUpdated, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Account Home Domain Updated Effect.
 */
export class AccountHomeDomainUpdatedEffect extends Effect<
	EffectTypeNames.accountHomeDomainUpdated,
	EffectType.account_home_domain_updated
> {
	/**
	 * The updated home domain of the account.
	 */
	public homeDomain!: string;

	public constructor(client: Client, data: AccountHomeDomainUpdated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: AccountHomeDomainUpdated): void {
		super.$patch(data);

		this.homeDomain = data.home_domain;
	}
}
