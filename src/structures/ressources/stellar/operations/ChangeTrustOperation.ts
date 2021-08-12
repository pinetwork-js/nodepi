import { AssetType, Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Asset } from '../Asset';
import { Operation } from './Operation';

/**
 * Structure representing a Stellar Change Trust Operation.
 */
export class ChangeTrustOperation extends Operation<
	Horizon.OperationResponseType.changeTrust,
	Horizon.OperationResponseTypeI.changeTrust
> {
	/**
	 * The type of asset being trusted. Either credit_alphanum4, or credit_alphanum12.
	 */
	public assetType!: AssetType.credit4 | AssetType.credit12;

	/**
	 * The Stellar address of the asset being trusted.
	 */
	public assetCode!: string;

	/**
	 * The code for the asset being trusted.
	 */
	public assetIssuerId!: string;

	/**
	 * The limit on the amount of an asset that the source account can hold.
	 */
	public limit!: number;

	/**
	 * The if of the issuing account.
	 */
	public trusteeId!: string;

	/**
	 * The id of the source account.
	 */
	public trustorId!: string;

	public constructor(client: Client, data: ServerApi.ChangeTrustOperationRecord) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ServerApi.ChangeTrustOperationRecord): void {
		super.$patch(data);

		this.assetType = data.asset_type;
		this.assetCode = data.asset_code;
		this.assetIssuerId = data.asset_issuer;
		this.limit = Number(data.limit);
		this.trusteeId = data.trustee;
		this.trustorId = data.trustor;
	}

	/**
	 * Get the account of the trustee.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the trustee account instead.
	 * @returns The account of the trustee.
	 */
	public getTrusteeAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.trusteeId, true, !forceUpdate);
	}

	/**
	 * Get the account of the trustor.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the trustor account instead.
	 * @returns The account of the trustor.
	 */
	public getTrustorAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.trustorId, true, !forceUpdate);
	}

	/**
	 * Get the trusted asset.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the trusted asset instead.
	 * @returns The trusted asset.
	 */
	public getTrustedAsset(forceUpdate = false): Promise<Asset> {
		const assetId = `${this.assetCode}:${this.assetIssuerId}`;

		return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
	}
}
