import { ServerApi } from 'stellar-sdk';

import { Client } from '../../../clients';
import { isApplicationOperation, isApplicationTransaction } from '../../../utils';
import { isApplicationEffect } from '../../../utils/isApplicationEffect';
import { Identifiable } from '../../interfaces';
import { OperationManager, TransactionManager } from '../../managers';
import { EffectManager } from '../../managers/stellar/EffectManager';

/**
 * Structure representing a Stellar Ledger.
 */
export class Ledger implements Identifiable<string> {
	/**
	 * The id of the ledger.
	 */
	public id!: string;

	/**
	 * A cursor value for use in pagination.
	 */
	public pagingToken!: string;

	/**
	 * A hex-encoded SHA-256 hash of the ledger’s XDR-encoded form.
	 */
	public hash!: string;

	/**
	 * The hash of the ledger immediately preceding the ledger.
	 */
	public previousHash!: string;

	/**
	 * The sequence number of the ledger, and the parameter used in Horizon calls that require a ledger number.
	 */
	public sequence!: number;

	/**
	 * The number of transactions in the ledger.
	 */
	public transactionCount!: number;

	/**
	 * The number of operations applied in the ledger.
	 */
	public operationCount!: number;

	/**
	 * The total number of operations in the ledger transaction set.
	 */
	public transactionSetOperationCount?: number;

	/**
	 * The date when the ledger was closed.
	 */
	public closedAt!: Date;

	/**
	 * The timestamp when the ledger was closed.
	 */
	public closedTimestamp!: number;

	/**
	 * The total number of Pi in circulation.
	 */
	public totalCoins!: string;

	/**
	 * The sum of all transaction fees.
	 */
	public feePool!: string;

	/**
	 * The fee the network charges per operation in a transaction.
	 */
	public baseFeeInMicropi!: number;

	/**
	 * The reserve the network uses when calculating an account’s minimum balance.
	 */
	public baseReserveInMicropi!: number;

	/**
	 * The maximum number of operations validators have agreed to process in a given ledger. Since Protocol 11, ledger capacity has been measured in operations rather than transactions.
	 */
	public maxTransactionSetSize!: number;

	/**
	 * The protocol version that the Pi Network Stellar network was running when the ledger was committed.
	 */
	public protocolVersion!: number;

	/**
	 * A base64 encoded string of the raw LedgerHeader xdr struct for the ledger.
	 */
	public headerXdr!: string;

	/**
	 * Get the transactions of the ledger.
	 */
	private $transactions!: ServerApi.LedgerRecord['transactions'];

	/**
	 * Get the operations of the ledger.
	 */
	private $operations!: ServerApi.LedgerRecord['operations'];

	/**
	 * Get the effects of the ledger.
	 */
	private $effects!: ServerApi.LedgerRecord['effects'];

	public constructor(public readonly client: Client, data: ServerApi.LedgerRecord) {
		this.$patch(data);
	}

	public $patch(data: ServerApi.LedgerRecord): void {
		this.id = data.id;
		this.pagingToken = data.paging_token;
		this.hash = data.hash;
		this.previousHash = data.prev_hash;
		this.sequence = data.sequence;
		this.transactionCount = data.transaction_count;
		this.operationCount = data.operation_count;
		this.transactionSetOperationCount = data.tx_set_operation_count ?? undefined;
		this.closedAt = new Date(data.closed_at);
		this.closedTimestamp = this.closedAt.getTime();
		this.totalCoins = data.total_coins;
		this.feePool = data.fee_pool;
		this.baseFeeInMicropi = data.base_fee_in_stroops;
		this.baseReserveInMicropi = data.base_reserve_in_stroops;
		this.maxTransactionSetSize = data.max_tx_set_size;
		this.protocolVersion = data.protocol_version;
		this.headerXdr = data.header_xdr;

		this.$transactions = data.transactions;
		this.$operations = data.operations;
		this.$effects = data.effects;
	}

	/**
	 * Get the transactions of the ledger.
	 *
	 * @returns A manager for the ledger transactions.
	 */
	public async getTransactions(): Promise<TransactionManager> {
		const transactions = (await this.$transactions()).records;

		for (const transaction of transactions) {
			if (
				this.client.stellar.account &&
				!(await isApplicationTransaction(transaction, this.client.stellar.account.publicKey()))
			) {
				continue;
			}

			this.client.stellar.transactions.add(transaction);
		}

		return new TransactionManager(this.client.stellar, transactions);
	}

	/**
	 * Get the operations of the ledger.
	 *
	 * @returns A manager for the ledger operations.
	 */
	public async getOperations(): Promise<OperationManager> {
		const operations = (await this.$operations()).records;

		for (const operation of operations) {
			if (this.client.stellar.account && !isApplicationOperation(operation, this.client.stellar.account.publicKey())) {
				continue;
			}

			this.client.stellar.operations.add(operation);
		}

		return new OperationManager(this.client.stellar, operations);
	}

	/**
	 * Get the effects of the ledger.
	 *
	 * @returns A manager for the ledger effects.
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
}
