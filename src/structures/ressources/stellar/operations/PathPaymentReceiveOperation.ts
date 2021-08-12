import { AssetType, Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { AssetManager } from '../../../managers';
import { Account } from '../Account';
import { Asset } from '../Asset';
import { Operation } from './Operation';

export interface IntermediaryAsset {
	/**
	 * The type for the intermediary asset. Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	assetType: AssetType;

	/**
	 * The code of the intermediary asset.
	 */
	assetCode: string;

	/**
	 * The Stellar address of the intermediary asset’s issuer.
	 */
	assetIssuerId: string;
}

/**
 * Structure representing a Stellar Path Payment Receive Operation.
 */
export class PathPaymentReceiveOperation extends Operation<
	Horizon.OperationResponseType.pathPayment,
	Horizon.OperationResponseTypeI.pathPayment
> {
	/**
	 * The type of asset being received. Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	public assetType!: AssetType;

	/**
	 * The code for the asset being received. Appears if `assetType` is not native.
	 */
	public assetCode?: string;

	/**
	 * The Stellar address of the issuer of the asset being received. Appears if `assetType` is not native.
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
	 * The amount received designated in the destination asset.
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
	 * The maximum amount to be sent designated in the source asset.
	 */
	public sourceMax!: number;

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

	public constructor(client: Client, data: ServerApi.PathPaymentOperationRecord) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ServerApi.PathPaymentOperationRecord): void {
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
		this.sourceMax = Number(data.source_max);
		this.sourceAssetcode = data.source_asset_code;
		this.sourceAssetIssuerId = data.source_asset_issuer;
		this.sourceAssetType = data.source_asset_type;
	}

	/**
	 * Get the received asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the received asset instead.
	 * @returns The received asset if it's not `native`.
	 */
	public async getReceivedAsset(forceUpdate = false): Promise<Asset | undefined> {
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
