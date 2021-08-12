import { Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { isApplicationEffect } from '../../../../utils/isApplicationEffect';
import { Identifiable } from '../../../interfaces';
import { EffectManager } from '../../../managers/stellar/EffectManager';
import { Account } from '../Account';
import { Transaction } from '../Transaction';

/**
 * Structure representing a Stellar Operation.
 */
export class Operation<
	TN extends Horizon.OperationResponseType = Horizon.OperationResponseType,
	T extends Horizon.OperationResponseTypeI = Horizon.OperationResponseTypeI,
> implements Identifiable<string>
{
	/**
	 * The id of the operation.
	 */
	public id!: string;

	/**
	 * A cursor value for use in pagination.
	 */
	public pagingToken!: string;

	/**
	 * The name of the operation type.
	 */
	public typeName!: TN;

	/**
	 * The numeric type of the operation.
	 */
	public type!: T;

	/**
	 * A unique id for the transaction the operation belongs to.
	 */
	public transactionHash!: string;

	/**
	 * The account that originates the operation.
	 */
	public sourceAccountId!: string;

	/**
	 * The operation's creation date.
	 */
	public createdAt!: Date;

	/**
	 * The operation's creation timestamp.
	 */
	public createdTimestamp!: number;

	/**
	 * Get the effects of the operation.
	 */
	private $effects!: ServerApi.AccountRecord['effects'];

	public constructor(public readonly client: Client, data: ServerApi.OperationRecord) {
		this.$patch(data);
	}

	public $patch(data: ServerApi.OperationRecord): void {
		this.id = data.id;
		this.pagingToken = data.paging_token;
		this.typeName = data.type as TN;
		this.type = data.type_i as T;
		this.transactionHash = data.transaction_hash;
		this.sourceAccountId = data.source_account;
		this.createdAt = new Date(data.created_at);
		this.createdTimestamp = this.createdAt.getTime();

		this.$effects = data.effects;
	}

	/**
	 * Get the effects of the operation.
	 *
	 * @returns A manager for the operation effects.
	 */
	public async getEffects(): Promise<EffectManager> {
		const effects = (await this.$effects()).records;

		for (const effect of effects) {
			if (this.client.stellar.account && !isApplicationEffect(effect, this.client.stellar.account.publicKey())) {
				continue;
			}

			this.client.stellar.effects.add(effect);
		}

		return new EffectManager(this.client.stellar, effects);
	}

	/**
	 * Get the transaction the operation belongs to.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the transaction instead.
	 * @returns The transaction of the operation.
	 */
	public getTransaction(forceUpdate = false): Promise<Transaction> {
		return this.client.stellar.transactions.fetch(this.transactionHash, true, !forceUpdate);
	}

	/**
	 * Get the source account of the operation.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the source account instead.
	 * @returns The source account of the operation.
	 */
	public getSourceAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.sourceAccountId, true, !forceUpdate);
	}
}
