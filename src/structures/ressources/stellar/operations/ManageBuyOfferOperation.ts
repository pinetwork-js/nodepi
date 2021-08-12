import { AssetType, Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Asset } from '../Asset';
import { Offer, PriceRational } from '../Offer';
import { Operation } from './Operation';

/**
 * Structure representing a Stellar Manage Buy Offer Operation.
 */
export class ManageBuyOfferOperation extends Operation<
	Horizon.OperationResponseType.manageBuyOffer,
	Horizon.OperationResponseTypeI.manageBuyOffer
> {
	/**
	 * The amount of `sellingAsset` that the account making the offer is willing to buy.
	 */
	public amount!: number;

	/**
	 * How many units of `buyingAsset` it takes to get 1 unit of `sellingAsset`. A number representing the decimal form of `priceRational`.
	 */
	public price!: number;

	/**
	 * A precise representation of the buy and sell price of the assets on offer.
	 */
	public priceRational!: PriceRational;

	/**
	 * The type for the buying asset. Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	public buyingAssetType!: AssetType;

	/**
	 * The Stellar address of the buying asset’s issuer. Appears if `buyingAssetType` is not native.
	 */
	public buyingAssetIssuerId?: string;

	/**
	 * The code for the buying asset. Appears if `buyingAssetType` is not native.
	 */
	public buyingAssetCode?: string;

	/**
	 * The type for the selling asset. Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	public sellingAssetType!: AssetType;

	/**
	 * The Stellar address of the selling asset’s issuer. Appears if `sellingAssetType` is not native.
	 */
	public sellingAssetIssuerId?: string;

	/**
	 * The code for the selling asset. Appears if `sellingAssetType` is not native.
	 */
	public sellingAssetCode?: string;

	/**
	 * The id of the offer.
	 */
	public offerId!: string;

	public constructor(client: Client, data: ServerApi.ManageOfferOperationRecord) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ServerApi.ManageOfferOperationRecord): void {
		super.$patch(data);

		this.amount = Number(data.amount);
		this.price = Number(data.price);
		this.priceRational = data.price_r;
		this.buyingAssetType = data.buying_asset_type;
		this.buyingAssetIssuerId = data.buying_asset_issuer;
		this.buyingAssetCode = data.buying_asset_code;
		this.sellingAssetType = data.selling_asset_type;
		this.sellingAssetIssuerId = data.selling_asset_issuer;
		this.sellingAssetCode = data.selling_asset_code;
		this.offerId = String(data.offer_id);
	}

	/**
	 * Get the selling asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the selling asset instead.
	 * @returns The selling asset if it's not `native`.
	 */
	public async getSellingAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.sellingAssetType === 'native') {
			return;
		}

		const assetId = `${this.sellingAssetCode}:${this.sellingAssetIssuerId}`;

		return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
	}

	/**
	 * Get the buying asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the buying asset instead.
	 * @returns The buying asset if it's not `native`.
	 */
	public async getBuyingAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.buyingAssetType === 'native') {
			return;
		}

		const assetId = `${this.buyingAssetCode}:${this.buyingAssetIssuerId}`;

		return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
	}

	/**
	 * Get the offer.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the offer instead.
	 * @returns The offer.
	 */
	public getOffer(forceUpdate = false): Promise<Offer> {
		return this.client.stellar.offers.fetch(this.offerId, true, !forceUpdate);
	}
}
