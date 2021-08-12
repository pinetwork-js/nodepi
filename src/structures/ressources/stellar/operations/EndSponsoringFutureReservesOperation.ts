import { Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Operation } from './Operation';

/**
 * Structure representing a Stellar End Sponsoring Future Reserves Operation.
 */
export class EndSponsoringFutureReservesOperation extends Operation<
	Horizon.OperationResponseType.endSponsoringFutureReserves,
	Horizon.OperationResponseTypeI.endSponsoringFutureReserves
> {
	/**
	 * The id of the account which initiated the sponsorship.
	 */
	public sponsorId!: string;

	public constructor(client: Client, data: ServerApi.EndSponsoringFutureReservesOperationRecord) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ServerApi.EndSponsoringFutureReservesOperationRecord): void {
		super.$patch(data);

		this.sponsorId = data.begin_sponsor;
	}

	/**
	 * Get the account which initiated the sponsorship.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the sponsor account instead.
	 * @returns The account of the sponsor.
	 */
	public getSponsorAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.sponsorId, true, !forceUpdate);
	}
}
