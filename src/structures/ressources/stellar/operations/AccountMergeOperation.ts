import { Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Operation } from './Operation';

/**
 * Structure representing a Stellar Account Merge Operation.
 */
export class AccountMergeOperation extends Operation<
	Horizon.OperationResponseType.accountMerge,
	Horizon.OperationResponseTypeI.accountMerge
> {
	/**
	 * The Stellar address being removed.
	 */
	public removedAccountId!: string;

	/**
	 * The Stellar address receiving the deleted account’s pi.
	 */
	public receiverId!: string;

	public constructor(client: Client, data: ServerApi.AccountMergeOperationRecord) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ServerApi.AccountMergeOperationRecord): void {
		super.$patch(data);

		this.removedAccountId = data.source_account;
		this.receiverId = data.into;
	}

	/**
	 * Get the account receiving the deleted account’s pi.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the receiver account instead.
	 * @returns The account receiving the deleted account’s pi.
	 */
	public getReceiverAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.receiverId, true, !forceUpdate);
	}
}
