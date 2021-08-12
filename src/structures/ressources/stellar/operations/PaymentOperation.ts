import { AssetType, Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Asset } from '../Asset';
import { Operation } from './Operation';

/**
 * Structure representing a Stellar Payment Operation.
 */
export class PaymentOperation extends Operation<
	Horizon.OperationResponseType.payment,
	Horizon.OperationResponseTypeI.payment
> {
	/**
	 * The type of asset being sent. Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	public assetType!: AssetType;

	/**
	 * The code for the asset being sent. Appears if `assetType` is not native.
	 */
	public assetCode?: string;

	/**
	 * The Stellar address of the issuer of the asset being sent. Appears if `assetType` is not native.
	 */
	public assetIssuerId?: string;

	/**
	 * The payment sender’s public key.
	 */
	public senderId!: string;

	/**
	 * The payment recipient’s public key.
	 */
	public recipientId!: string;

	/**
	 * The amount sent.
	 */
	public amount!: number;

	public constructor(client: Client, data: ServerApi.PaymentOperationRecord) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ServerApi.PaymentOperationRecord): void {
		super.$patch(data);

		this.assetType = data.asset_type;
		this.assetCode = data.asset_code;
		this.assetIssuerId = data.asset_issuer;
		this.senderId = data.from;
		this.recipientId = data.to;
		this.amount = Number(data.amount);
	}

	/**
	 * Get the sent asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the sent asset instead.
	 * @returns The sent asset if it's not `native`.
	 */
	public async getSentAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.assetType === 'native') {
			return;
		}

		const assetId = `${this.assetCode}:${this.assetIssuerId}`;

		return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
	}

	/**
	 * Get the account of the payment sender.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the sender account instead.
	 * @returns The account of the sender.
	 */
	public getSenderAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.senderId, true, !forceUpdate);
	}

	/**
	 * Get the account of the payment recipient.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the recipient account instead.
	 * @returns The account of the recipient.
	 */
	public getRecipientAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.recipientId, true, !forceUpdate);
	}
}
