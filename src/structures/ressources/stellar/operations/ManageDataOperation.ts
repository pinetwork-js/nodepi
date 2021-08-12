import { Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Operation } from './Operation';

/**
 * Structure representing a Stellar Manage Data Operation.
 */
export class ManageDataOperation extends Operation<
	Horizon.OperationResponseType.manageData,
	Horizon.OperationResponseTypeI.manageData
> {
	/**
	 * The key for this data entry. It can be up to 64 bytes long.
	 */
	public name!: string;

	/**
	 * The value for this data entry. It can be up to 64 bytes long. If not present, then the existing key has been deleted.
	 */
	public value?: string;

	public constructor(client: Client, data: ServerApi.ManageDataOperationRecord) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ServerApi.ManageDataOperationRecord): void {
		super.$patch(data);

		this.name = data.name;
		this.value = data.value.toString('base64');
	}
}
