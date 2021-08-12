import { Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Operation } from './Operation';

/**
 * Structure representing a Stellar Begin Sponsoring Future Reserves Operation.
 */
export class BeginSponsoringFutureReservesOperation extends Operation<
	Horizon.OperationResponseType.beginSponsoringFutureReserves,
	Horizon.OperationResponseTypeI.beginSponsoringFutureReserves
> {
	/**
	 * The id of the account which will be sponsored.
	 */
	public sponsoredId!: string;

	public constructor(client: Client, data: ServerApi.BeginSponsoringFutureReservesOperationRecord) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ServerApi.BeginSponsoringFutureReservesOperationRecord): void {
		super.$patch(data);

		this.sponsoredId = data.sponsored_id;
	}

	/**
	 * Get the sponsored account.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the sponsored account instead.
	 * @returns The sponsored account.
	 */
	public getSponsoredAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.sponsoredId, true, !forceUpdate);
	}
}
