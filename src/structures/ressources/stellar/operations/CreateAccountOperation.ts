import { Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Operation } from './Operation';

/**
 * Structure representing a Stellar Create Account Operation.
 */
export class CreateAccountOperation extends Operation<
	Horizon.OperationResponseType.createAccount,
	Horizon.OperationResponseTypeI.createAccount
> {
	/**
	 * The amount of Pi to send to the newly created account.
	 */
	public startingBalance!: number;

	/**
	 * The account that funds the new account.
	 */
	public funderId!: string;

	/**
	 * The new account that is funded.
	 */
	public newAccountId!: string;

	public constructor(client: Client, data: ServerApi.CreateAccountOperationRecord) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ServerApi.CreateAccountOperationRecord): void {
		super.$patch(data);

		this.newAccountId = data.account;
		this.funderId = data.funder;
		this.startingBalance = Number(data.starting_balance);
	}

	/**
	 * Get the account that funds the new account.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the funder account instead.
	 * @returns The account of the funder.
	 */
	public getFunderAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.funderId, true, !forceUpdate);
	}

	/**
	 * Get the new account that is funded.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the new account instead.
	 * @returns The new funded account.
	 */
	public getNewAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.newAccountId, true, !forceUpdate);
	}
}
