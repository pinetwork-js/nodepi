import { EffectType, SequenceBumped } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Sequence Bumped Effect.
 */
export class SequenceBumpedEffect extends Effect<EffectTypeNames.sequenceBumped, EffectType.sequence_bumped> {
	/**
	 * The new sequence.
	 */
	public newSequence!: string;

	public constructor(client: Client, data: SequenceBumped) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: SequenceBumped): void {
		super.$patch(data);

		this.newSequence = String(data.new_seq);
	}
}
