import { MemoType, ServerApi } from 'stellar-sdk';
import { Payment } from '../..';

import { Client } from '../../../clients';
import { isApplicationEffect } from '../../../utils/isApplicationEffect';
import { isApplicationOperation } from '../../../utils/isApplicationOperation';
import { Identifiable } from '../../interfaces';
import { OperationManager } from '../../managers';
import { EffectManager } from '../../managers/stellar/EffectManager';
import { Account } from './Account';
import { Ledger } from './Ledger';

/**
 * Structure representing a Stellar Transaction.
 */
export class Transaction implements Identifiable<string> {
	/**
	 * The id of the transaction.
	 */
	public id!: string;

	/**
	 * A cursor value for use in pagination.
	 */
	public pagingToken!: string;

	/**
	 * A hex-encoded SHA-256 hash of the transaction’s XDR-encoded form.
	 */
	public hash!: string;

	/**
	 * The sequence number of the ledger that the transaction was included in.
	 */
	public ledgerSequence!: number;

	/**
	 * The transaction creation date.
	 */
	public createdAt!: Date;

	/**
	 * The transaction creation timestamp.
	 */
	public createdTimestamp!: number;

	/**
	 * The account that originates the transaction.
	 */
	public sourceAccountId!: string;

	/**
	 * The source account’s sequence number that the transaction consumed.
	 */
	public sourceAccountSequence!: string;

	/**
	 * The fee (in micropi) paid by the source account to apply this transaction to the ledger.
	 */
	public feeCharged!: number | string;

	/**
	 * The maximum fee (in micropi) that the source account was willing to pay.
	 */
	public maxFee!: number | string;

	/**
	 * The number of operations contained within the transaction.
	 */
	public operationCount!: number;

	/**
	 * A base64 encoded string of the raw TransactionEnvelope XDR struct for the transaction.
	 */
	public envelopeXdr!: string;

	/**
	 * A base64 encoded string of the raw TransactionResult XDR struct for the transaction.
	 */
	public resultXdr!: string;

	/**
	 * A base64 encoded string of the raw TransactionMeta XDR struct for the transaction.
	 */
	public resultMetaXdr!: string;

	/**
	 * A base64 encoded string of the raw LedgerEntryChanges XDR struct produced by taking fees for the transaction.
	 */
	public feeMetaXdr!: string;

	/**
	 * The memo attached to the transaction (the payment id of the transaction if made using Pi Network SDK).
	 */
	private _memo?: string;

	/**
	 * The type of memo. Potential values include `none`, `id`, `text`, `hash` and `return`.
	 */
	public memoType!: MemoType;

	/**
	 * The signatures used to sign the transaction.
	 */
	public signatures!: string[];

	/**
	 * Get the operations of the transaction.
	 */
	private $operations!: ServerApi.TransactionRecord['operations'];

	/**
	 * Get the effects of the transaction.
	 */
	private $effects!: ServerApi.TransactionRecord['effects'];

	public constructor(public readonly client: Client, data: ServerApi.TransactionRecord) {
		this.$patch(data);
	}

	public $patch(data: ServerApi.TransactionRecord): void {
		this.id = data.id;
		this.pagingToken = data.paging_token;
		this.hash = data.hash;
		this.ledgerSequence = data.ledger_attr;
		this.createdAt = new Date(data.created_at);
		this.createdTimestamp = this.createdAt.getTime();
		this.sourceAccountId = data.source_account;
		this.sourceAccountSequence = data.source_account_sequence;
		this.feeCharged = data.fee_charged;
		this.maxFee = data.max_fee;
		this.operationCount = data.operation_count;
		this.envelopeXdr = data.envelope_xdr;
		this.resultXdr = data.result_xdr;
		this.resultMetaXdr = data.result_meta_xdr;
		this.feeMetaXdr = data.fee_meta_xdr;
		this._memo = data.memo;
		this.memoType = data.memo_type;
		this.signatures = data.signatures;

		this.$operations = data.operations;
		this.$effects = data.effects;
	}

	/**
	 * The memo of the transaction. If the transaction was made using the Pi Network SDK, the memo is equal to the platform payment id, so it retrieve the platform payment, then the memo from it.
	 */
	public get memo(): string | undefined {
		if (!this._memo) {
			return;
		}

		const payment = this.client.payments.resolve(this._memo);

		return payment ? payment.memo : this._memo;
	}

	/**
	 * Get the platform payment of the transaction if made using Pi Network SDK.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the platform payment instead.
	 * @returns The platform payment of the transaction if made using Pi Network SDK.
	 */
	public async getPayment(forceUpdate = false): Promise<Payment | undefined> {
		if (!this._memo) {
			return;
		}

		const payment = this.client.payments.resolve(this._memo);

		return payment ? this.client.payments.fetch(this._memo, true, !forceUpdate) : undefined;
	}

	/**
	 * Get the ledger the trasaction belongs to.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the ledger instead.
	 * @returns The ledger the trasaction belongs to.
	 */
	public async getLedger(forceUpdate = false): Promise<Ledger> {
		return this.client.stellar.ledgers.fetch(this.ledgerSequence, true, !forceUpdate);
	}

	/**
	 * Get the operations of the transaction.
	 *
	 * @returns A manager for the transaction operations.
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
	 * Get the effects of the transaction.
	 *
	 * @returns A manager for the transaction effects.
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
	 * Get the source account of the transaction.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the source account instead.
	 * @returns The source account of the transaction.
	 */
	public getSourceAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.sourceAccountId, true, !forceUpdate);
	}
}
