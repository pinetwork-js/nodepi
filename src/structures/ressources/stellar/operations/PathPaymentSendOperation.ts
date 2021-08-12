import { AssetType, Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { AssetManager } from '../../../managers';
import { Account } from '../Account';
import { Asset } from '../Asset';
import { Operation } from './Operation';
import { IntermediaryAsset } from './PathPaymentReceiveOperation';

/**
 * Structure representing a Stellar Path Payment Send Operation.
 */
export class PathPaymentSendOperation extends Operation<
	Horizon.OperationResponseType.pathPaymentStrictSend,
	Horizon.OperationResponseTypeI.pathPaymentStrictSend
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
	 * The amount received designated in the source asset.
	 */
	public amount!: number;

	/**
	 * The intermediary assets that this path hops through.
	 */
	public path!: IntermediaryAsset[];

	/**
	 * The amount sent designated in the source asset.
	 */
	public sourceAmount!: number;

	/**
	 * The minimum amount of destination asset expected to be received.
	 */
	public destinationMin!: string;

	/**
	 * The type for the source asset. Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	public sourceAssetType!: AssetType;

	/**
	 * The code for the source asset. Appears if `sourceAssetType` is not native.
	 */
	public sourceAssetcode?: string;

	/**
	 * The Stellar address of the source asset’s issuer. Appears if `sourceAssetType` is not native.
	 */
	public sourceAssetIssuerId?: string;

	public constructor(client: Client, data: ServerApi.PathPaymentStrictSendOperationRecord) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ServerApi.PathPaymentStrictSendOperationRecord): void {
		super.$patch(data);

		this.assetType = data.asset_type;
		this.assetCode = data.asset_code;
		this.assetIssuerId = data.asset_issuer;
		this.senderId = data.from;
		this.recipientId = data.to;
		this.amount = Number(data.amount);
		this.path = data.path.map((path) => ({
			assetCode: path.asset_code,
			assetIssuerId: path.asset_issuer,
			assetType: path.asset_type,
		}));
		this.sourceAmount = Number(data.source_amount);
		this.destinationMin = data.destination_min;
		this.sourceAssetcode = data.source_asset_code;
		this.sourceAssetIssuerId = data.source_asset_issuer;
		this.sourceAssetType = data.source_asset_type;
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
	 * Get the source asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the source asset instead.
	 * @returns The source asset if it's not `native`.
	 */
	public async getSourceAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.sourceAssetType === 'native') {
			return;
		}

		const assetId = `${this.sourceAssetcode}:${this.sourceAssetIssuerId}`;

		return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
	}

	/**
	 * Get the non-native intermediary assets.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the intermediary assets asset instead.
	 * @returns A manager for the intermediary assets.
	 */
	public async getIntermediaryAssets(forceUpdate = false): Promise<AssetManager> {
		const assets = await Promise.all(
			this.path
				.filter((asset) => asset.assetType !== 'native')
				.map((asset) => {
					const assetId = `${asset.assetCode}:${asset.assetIssuerId}`;

					return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
				}),
		);

		return new AssetManager(this.client.stellar, assets);
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
