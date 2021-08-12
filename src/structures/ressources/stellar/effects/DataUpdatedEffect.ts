import { DataUpdated, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Data Updated Effect.
 */
export class DataUpdatedEffect extends Effect<EffectTypeNames.dataUpdated, EffectType.data_updated> {
	/**
	 * The name of the updated account data.
	 */
	public name!: string;

	/**
	 * The new value of the updated account data.
	 */
	public value!: string;

	public constructor(client: Client, data: DataUpdated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: DataUpdated): void {
		super.$patch(data);

		this.name = data.name as unknown as string;
		this.value = data.value as unknown as string;
	}
}
