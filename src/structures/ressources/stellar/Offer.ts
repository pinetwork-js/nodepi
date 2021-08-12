import { AssetType, ServerApi } from 'stellar-sdk';

import { Client } from '../../../clients';
import { Identifiable } from '../../interfaces';
import { Account } from './Account';
import { Asset } from './Asset';
import { Ledger } from './Ledger';

interface OfferAsset {
	/**
	 * The type of the asset. Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	assetType: AssetType;

	/**
	 * The code for the asset. Appears if `assetType` is not native.
	 */
	assetCode?: string;

	/**
	 * The Stellar address of the asset’s issuer. Appears if `assetType` is not native.
	 */
	assetIssuerId?: string;
}

export interface PriceRational {
	/**
	 * The rational numerator.
	 */
	numerator: number;

	/**
	 * The rational denominator.
	 */
	denominator: number;
}

/**
 * Structure representing a Stellar Offer.
 */
export class Offer implements Identifiable<string> {
	/**
	 * The id of the offer.
	 */
	public id!: string;

	/**
	 * A cursor value for use in pagination.
	 */
	public pagingToken!: string;

	/**
	 * The id of the account making the offer.
	 */
	public sellerId!: string;

	/**
	 * The asset the seller wants to sell.
	 */
	public selling!: OfferAsset;

	/**
	 * The asset the seller wants to buy.
	 */
	public buying!: OfferAsset;

	/**
	 * The amount of `selling` that the account making this offer is willing to sell.
	 */
	public amount!: number;

	/**
	 * A precise representation of the buy and sell price of the assets on offer.
	 */
	public priceRational!: PriceRational;

	/**
	 * How many units of `buying` it takes to get 1 unit of `selling`. A number representing the decimal form of `priceRational`.
	 */
	public price!: string;

	/**
	 * The sequence number of the last ledger in which the offer was modified.
	 */
	public lastModifiedLedgerId!: number;

	/**
	 * The date when the offer was modified for the last time.
	 */
	public lastModifiedAt!: Date;

	/**
	 * The timestamp when the offer was modified for the last time.
	 */
	public lastModifiedTimestamp!: number;

	/**
	 * The account id of the sponsor who is paying the reserves for the offer.
	 */
	public sponsorId?: string;

	public constructor(public readonly client: Client, data: ServerApi.OfferRecord) {
		this.$patch(data);
	}

	public $patch(data: ServerApi.OfferRecord): void {
		this.id = String(data.id);
		this.pagingToken = data.paging_token;
		this.sellerId = data.seller;
		this.selling = {
			assetType: data.selling.asset_type,
			assetCode: data.selling.asset_code,
			assetIssuerId: data.selling.asset_issuer,
		};
		this.buying = {
			assetType: data.buying.asset_type,
			assetCode: data.buying.asset_code,
			assetIssuerId: data.buying.asset_issuer,
		};
		this.amount = Number(data.amount);
		this.priceRational = {
			numerator: data.price_r.n,
			denominator: data.price_r.d,
		};
		this.price = data.price;
		this.lastModifiedLedgerId = data.last_modified_ledger;
		this.lastModifiedAt = new Date(data.last_modified_time);
		this.lastModifiedTimestamp = this.lastModifiedAt.getTime();
		this.sponsorId = data.sponsor;
	}

	/**
	 * Get the seller of the offer.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the seller account instead.
	 * @returns The account of the seller.
	 */
	public getSellerAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.sellerId, true, !forceUpdate);
	}

	/**
	 * Get the sponsor of the offer if there is one.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the sponsor account instead.
	 * @returns The account of the sponsor if there is one.
	 */
	public async getSponsor(forceUpdate = false): Promise<Account | undefined> {
		if (!this.sponsorId) {
			return;
		}

		return this.client.stellar.accounts.fetch(this.sponsorId, true, !forceUpdate);
	}

	/**
	 * Get the last ledger that included changes to the offer.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the ledger instead.
	 * @returns The last ledger that included changes to the offer.
	 */
	public getLastModifiedLedger(forceUpdate = false): Promise<Ledger> {
		return this.client.stellar.ledgers.fetch(this.lastModifiedLedgerId, true, !forceUpdate);
	}

	/**
	 * Get the selling asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the selling asset instead.
	 * @returns The selling asset if it's not `native`.
	 */
	public async getSellingAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.selling.assetType === 'native') {
			return;
		}

		const assetId = `${this.selling.assetCode}:${this.selling.assetIssuerId}`;

		return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
	}

	/**
	 * Get the buying asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the buying asset instead.
	 * @returns The buying asset if it's not `native`.
	 */
	public async getBuyingAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.buying.assetType === 'native') {
			return;
		}

		const assetId = `${this.buying.assetCode}:${this.buying.assetIssuerId}`;

		return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
	}
}
