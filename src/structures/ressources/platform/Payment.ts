import { APIPayment, routes } from '@pinetwork-js/api-typing';

import { Client } from '../../../clients';
import { Identifiable } from '../../interfaces';
import { Transaction } from '../stellar';

interface PaymentStatus {
	/**
	 * Whether or not the payment has been approved by the developer.
	 */
	developerApproved: boolean;

	/**
	 * Whether or not the transaction of the payment has been verified on the blockchain.
	 */
	transactionVerified: boolean;

	/**
	 * Whether or not the payment has been completed by the developer.
	 */
	developerCompleted: boolean;

	/**
	 * Whether or not the payment has been cancelled by the developer or by Pi Network.
	 */
	cancelled: boolean;

	/**
	 * Whether or not the payment has been cancelled by the user.
	 */
	userCancelled: boolean;
}

interface PaymentTransaction {
	/**
	 * The id of the blockchain transaction.
	 */
	transactionId: string;

	/**
	 * Whether or not the transaction matches the payment.
	 */
	verified: boolean;
}

/**
 * Structure representing a Pi Network Payment.
 */
export class Payment implements Identifiable<string> {
	/**
	 * The id of the payment.
	 */
	public id!: string;

	/**
	 * The amount of the payment.
	 */
	public amount!: number;

	/**
	 * A string provided by the developer, shown to the user.
	 */
	public memo!: string;

	/**
	 * An object provided by the developer for their own usage.
	 */
	public metadata!: Record<string, unknown>;

	/**
	 * The user's app-specific id.
	 */
	public userUid!: string;

	/**
	 * The recipient address of the blockchain transaction.
	 */
	public recipientAdresse!: string;

	/**
	 * The date when the payment was created.
	 */
	public createdAt!: Date;

	/**
	 * The timestamp when the payment was created.
	 */
	public createdTimestamp!: number;

	/**
	 * The status flags representing the current state of the payment.
	 */
	public status!: PaymentStatus;

	/**
	 * The blockchain transaction data, this is null if no transaction has been made yet.
	 */
	public transactionInfo?: PaymentTransaction;

	public constructor(public readonly client: Client, data: APIPayment) {
		this.$patch(data);
	}

	public $patch(data: APIPayment): void {
		this.id = data.identifier;
		this.amount = data.amount;
		this.memo = data.memo;
		this.metadata = data.metadata;
		this.userUid = data.user_uid;
		this.recipientAdresse = data.to_address;
		this.createdAt = new Date(data.created_at);
		this.createdTimestamp = this.createdAt.getTime();
		this.status = {
			developerApproved: data.status.developer_approved,
			transactionVerified: data.status.transaction_verified,
			developerCompleted: data.status.developer_completed,
			cancelled: data.status.cancelled,
			userCancelled: data.status.user_cancelled,
		};

		if (data.transaction) {
			this.transactionInfo = {
				transactionId: data.transaction.txid,
				verified: data.transaction.verified,
			};
		}
	}

	/**
	 * Whether or not the payment has been cancelled.
	 */
	public get cancelled(): boolean {
		return this.status.cancelled || this.status.userCancelled;
	}

	/**
	 * Approve the payment.
	 *
	 * @returns The approved payment.
	 */
	public async approve(): Promise<Payment> {
		const payment = await this.client.http.request('post', routes.approvePayment({ paymentId: this.id }));

		return this.client.payments.add(payment);
	}

	/**
	 * Complete the payment.
	 *
	 * @returns The completed payment.
	 */
	public async complete(): Promise<Payment | undefined> {
		if (!this.transactionInfo) {
			return;
		}

		const payment = await this.client.http.request('post', routes.completePayment({ paymentId: this.id }), {
			txid: this.transactionInfo.transactionId,
		});

		return this.client.payments.add(payment);
	}

	/**
	 * Get the transaction of the payment if there is one.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the receiver transaction instead.
	 * @returns The transaction of the payment if there is one.
	 */
	public async getTransaction(forceUpdate = false): Promise<Transaction | undefined> {
		if (!this.transactionInfo) {
			return;
		}

		return this.client.stellar.transactions.fetch(this.transactionInfo.transactionId, true, !forceUpdate);
	}
}
