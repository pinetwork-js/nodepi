/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import { ServerApi } from 'stellar-sdk';

import { Client } from '../../../clients';
import { Identifiable } from '../../interfaces';
import { Account } from './Account';
import { Asset } from './Asset';
import { Offer, PriceRational } from './Offer';
import { Operation } from './operations';

/**
 * Structure representing a Stellar Trade.
 */
export class Trade implements Identifiable<string> {
	/**
	 * The id of the trade.
	 */
	public id!: string;

	/**
	 * A cursor value for use in pagination.
	 */
	public pagingToken!: string;

	/**
	 * The date when the ledger with the trade was closed.
	 */
	public ledgerClosedAt!: Date;

	/**
	 * The timestamp when the ledger with the trade was closed.
	 */
	public ledgerClosedTimestamp!: number;

	/**
	 * The account id of the base party for the trade.
	 */
	public baseAccountId!: string;

	/**
	 * The base offer id. If the offer was immediately and fully consumed, this will be a synethic id.
	 */
	public baseOfferId!: string;

	/**
	 * The amount of the base asset that was moved from `baseAccount` to `counterAccount`.
	 */
	public baseAmount!: number;

	/**
	 * The type for the base asset. Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	public baseAssetType!: string;

	/**
	 * The code for the base asset. Appears if `baseAssetType` is not native.
	 */
	public baseAssetCode?: string;

	/**
	 * The Stellar address of the base asset’s issuer. Appears if `baseAssetType` is not native.
	 */
	public baseAssetIssuerId?: string;

	/**
	 * The account id of the counter party for the trade.
	 */
	public counterAccountId!: string;

	/**
	 * The counter offer id. If the offer was immediately and fully consumed, this will be a synethic id.
	 */
	public counterOfferId!: string;

	/**
	 * The amount of the counter asset that was moved from `counterAccount` to `baseAccount`.
	 */
	public counterAmount!: number;

	/**
	 * The type for the counter asset. Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	public counterAssetType!: string;

	/**
	 * The code for the counter asset. Appears if `counterAssetType` is not native.
	 */
	public counterAssetCode?: string;

	/**
	 * The Stellar address of the counter asset’s issuer. Appears if `counterAssetType` is not native.
	 */
	public counterAssetIssuerId?: string;

	/**
	 * A precise representation of the original offer price.
	 */
	public price!: PriceRational;

	/**
	 * Whether or not the base party is the seller.
	 */
	public baseIsSeller!: boolean;

	public constructor(public readonly client: Client, data: ServerApi.TradeRecord) {
		this.$patch(data);
	}

	public $patch(data: ServerApi.TradeRecord): void {
		this.id = data.id;
		this.pagingToken = data.paging_token;
		this.ledgerClosedAt = new Date(data.ledger_close_time);
		this.ledgerClosedTimestamp = this.ledgerClosedAt.getTime();
		this.baseAccountId = data.base_account;
		this.baseOfferId = data.base_offer_id;
		this.baseAmount = Number(data.base_amount);
		this.baseAssetType = data.base_asset_type;
		this.baseAssetCode = data.base_asset_code;
		this.baseAssetIssuerId = data.base_asset_issuer;
		this.counterAccountId = data.counter_account;
		this.counterOfferId = data.counter_offer_id;
		this.counterAmount = Number(data.counter_amount);
		this.counterAssetType = data.counter_asset_type;
		this.counterAssetCode = data.counter_asset_code;
		this.counterAssetIssuerId = data.counter_asset_issuer;
		this.price = {
			numerator: (data as any).price.n,
			denominator: (data as any).price.d,
		};
		this.baseIsSeller = data.base_is_seller;
	}

	/**
	 * Get the base account of the trade.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the base account instead.
	 * @returns The base account.
	 */
	public getBaseAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.baseAccountId, true, !forceUpdate);
	}

	/**
	 * Get the base offer of the trade.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the base offer instead.
	 * @returns The base offer.
	 */
	public getBaseOffer(forceUpdate = false): Promise<Offer> {
		return this.client.stellar.offers.fetch(this.baseOfferId, true, !forceUpdate);
	}

	/**
	 * Get the base asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the base asset instead.
	 * @returns The base asset if it's not `native`.
	 */
	public async getBaseAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.baseAssetType === 'native') {
			return;
		}

		const assetId = `${this.baseAssetCode}:${this.baseAssetIssuerId}`;

		return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
	}

	/**
	 * Get the counter account of the trade.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the counter account instead.
	 * @returns The counter account.
	 */
	public getCounterAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.counterAccountId, true, !forceUpdate);
	}

	/**
	 * Get the counter offer of the trade.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the counter offer instead.
	 * @returns The counter offer.
	 */
	public getCounterOffer(forceUpdate = false): Promise<Offer> {
		return this.client.stellar.offers.fetch(this.baseAccountId, true, !forceUpdate);
	}

	/**
	 * Get the counter asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the counter asset instead.
	 * @returns The counter asset if it's not `native`.
	 */
	public async getCounterAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.counterAssetType === 'native') {
			return;
		}

		const assetId = `${this.counterAssetCode}:${this.counterAssetIssuerId}`;

		return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
	}

	/**
	 * Get the operation of the trade.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the operation instead.
	 * @returns The operation of the trade.
	 */
	public getOperation(forceUpdate = false): Promise<Operation> {
		const operationId = this.id.split('-')[0];

		return this.client.stellar.operations.fetch(operationId, true, !forceUpdate);
	}
}
