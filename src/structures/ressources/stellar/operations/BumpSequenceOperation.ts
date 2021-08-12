import { Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Operation } from './Operation';

/**
 * Structure representing a Stellar Bump Sequence Operation.
 */
export class BumpSequenceOperation extends Operation<
	Horizon.OperationResponseType.bumpSequence,
	Horizon.OperationResponseTypeI.bumpSequence
> {
	/**
	 * The new desired value for the source account’s sequence number.
	 */
	public bumpTo!: string;

	public constructor(client: Client, data: ServerApi.BumpSequenceOperationRecord) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ServerApi.BumpSequenceOperationRecord): void {
		super.$patch(data);

		this.bumpTo = data.bump_to;
	}
}
