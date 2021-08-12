import { AssetType, Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Asset } from '../Asset';
import { Operation } from './Operation';

/**
 * Structure representing a Stellar Allow Trust Operation.
 */
export class AllowTrustOperation extends Operation<
	Horizon.OperationResponseType.allowTrust,
	Horizon.OperationResponseTypeI.allowTrust
> {
	/**
	 * The type of asset. Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	public assetType!: AssetType;

	/**
	 * The Stellar address of the asset.
	 */
	public assetCode!: string;

	/**
	 * The code for the asset.
	 */
	public assetIssuerId!: string;

	/**
	 * The id of the issuing account, or source account.
	 */
	public trusteeId!: string;

	/**
	 * The id of the trusting account, or the account being authorized or unauthorized.
	 */
	public trustorId!: string;

	/**
	 * Whether or not the issuer authorize the issuing account to perform transactions with its credit.
	 */
	public authorize!: boolean;

	/**
	 * Whether or not the issuer authorize the issuing account to maintain and reduce liabilities for its credit.
	 */
	public authorizeToMaintainLiabilities!: boolean;

	public constructor(client: Client, data: ServerApi.AllowTrustOperationRecord) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ServerApi.AllowTrustOperationRecord): void {
		super.$patch(data);

		this.assetType = data.asset_type;
		this.assetCode = data.asset_code;
		this.assetIssuerId = data.asset_issuer;
		this.trusteeId = data.trustee;
		this.trustorId = data.trustor;
		this.authorize = data.authorize;
		this.authorizeToMaintainLiabilities = data.authorize_to_maintain_liabilities;
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
	 * Get the asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the asset instead.
	 * @returns The asset if it's not `native`.
	 */
	public async getAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.assetType === 'native') {
			return;
		}

		const assetId = `${this.assetCode}:${this.assetIssuerId}`;

		return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
	}
}
