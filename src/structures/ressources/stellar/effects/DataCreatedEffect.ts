import { DataCreated, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Data Created Effect.
 */
export class DataCreatedEffect extends Effect<EffectTypeNames.dataCreated, EffectType.data_created> {
	/**
	 * The name of the created account data.
	 */
	public name!: string;

	/**
	 * The value of the created account data.
	 */
	public value!: string;

	public constructor(client: Client, data: DataCreated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: DataCreated): void {
		super.$patch(data);

		this.name = data.name as unknown as string;
		this.value = data.value as unknown as string;
	}
}
