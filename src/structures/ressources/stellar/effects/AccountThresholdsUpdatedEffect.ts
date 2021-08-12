import { AccountThresholdsUpdated, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Account Thresholds Updated Effect.
 */
export class AccountThresholdsUpdatedEffect extends Effect<
	EffectTypeNames.accountThresholdsUpdated,
	EffectType.account_thresholds_updated
> {
	/**
	 * The updated weight required for a valid transaction including the Allow Trust and Bump Sequence operations.
	 */
	public lowThreshold!: number;

	/**
	 * The updated weight required for a valid transaction including the Create Account, Payment, Path Payment, Manage Buy Offer, Manage Sell Offer, Create Passive Sell Offer, Change Trust, Inflation, and Manage Data operations.
	 */
	public medThreshold!: number;

	/**
	 * The updated weight required for a valid transaction including the Account Merge and Set Options operations.
	 */
	public highThreshold!: number;

	public constructor(client: Client, data: AccountThresholdsUpdated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: AccountThresholdsUpdated): void {
		super.$patch(data);

		this.lowThreshold = data.low_threshold;
		this.medThreshold = data.med_threshold;
		this.highThreshold = data.high_threshold;
	}
}
