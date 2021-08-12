import { DataRemoved, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Data Removed Effect.
 */
export class DataRemovedEffect extends Effect<EffectTypeNames.dataRemoved, EffectType.data_removed> {
	/**
	 * The name of the removed account data.
	 */
	public name!: string;

	public constructor(client: Client, data: DataRemoved) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: DataRemoved): void {
		super.$patch(data);

		this.name = data.name as unknown as string;
	}
}
