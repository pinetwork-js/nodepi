import { Trade } from 'stellar-sdk/lib/types/trade';
import { EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Offer } from '../Offer';
import { Asset } from '../Asset';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Trade Effect.
 */
export class TradeEffect extends Effect<EffectTypeNames.trade, EffectType.trade> {
	/**
	 * The id of the seller.
	 */
	public sellerId!: string;

	/**
	 * The id of the offer.
	 */
	public offerId!: string;

	/**
	 * The amount of asset that was bought.
	 */
	public boughtAmount!: number;

	/**
	 * The type of the bought asset. Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	public boughtAssetType!: string;

	/**
	 * The code for the bought asset. Appears if `boughtAssetType` is not native.
	 */
	public boughtAssetCode?: string;

	/**
	 * The Stellar address of the bought asset’s issuer. Appears if `boughtAssetType` is not native.
	 */
	public boughtAssetIssuerId?: string;

	/**
	 * The amount of asset that was sold.
	 */
	public soldAmount!: number;

	/**
	 * The type of the sold asset. Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	public soldAssetType!: string;

	/**
	 * The code for the sold asset. Appears if `soldAssetType` is not native.
	 */
	public soldAssetCode?: string;

	/**
	 * The Stellar address of the sold asset’s issuer. Appears if `soldAssetType` is not native.
	 */
	public soldAssetIssuerId?: string;

	public constructor(client: Client, data: Trade) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: Trade): void {
		super.$patch(data);

		this.sellerId = data.seller;
		this.offerId = String(data.offer_id);
		this.boughtAmount = Number(data.bought_amount);
		this.boughtAssetType = data.bought_asset_type;
		this.boughtAssetCode = data.bought_asset_code;
		this.boughtAssetIssuerId = data.bought_asset_issuer;
		this.soldAmount = Number(data.sold_amount);
		this.soldAssetType = data.sold_asset_type;
		this.soldAssetCode = data.sold_asset_code;
		this.soldAssetIssuerId = data.sold_asset_issuer;
	}

	/**
	 * Get the account of the seller.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the seller account instead.
	 * @returns The account of the seller.
	 */
	public getSellerAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.sellerId, true, !forceUpdate);
	}

	/**
	 * Get the offer of the trade.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the offer instead.
	 * @returns The offer of the trade.
	 */
	public getOffer(forceUpdate = false): Promise<Offer> {
		return this.client.stellar.offers.fetch(this.sellerId, true, !forceUpdate);
	}

	/**
	 * Get the bought asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the bought asset instead.
	 * @returns The bought asset if it's not `native`.
	 */
	public async getBoughtAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.boughtAssetType === 'native') {
			return;
		}

		const assetId = `${this.boughtAssetCode}:${this.boughtAssetIssuerId}`;

		return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
	}

	/**
	 * Get the sold asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the sold asset instead.
	 * @returns The sold asset if it's not `native`.
	 */
	public async getSoldAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.soldAssetType === 'native') {
			return;
		}

		const assetId = `${this.soldAssetCode}:${this.soldAssetIssuerId}`;

		return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
	}
}
