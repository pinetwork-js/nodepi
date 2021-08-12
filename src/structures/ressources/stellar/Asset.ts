import { AssetType, ServerApi } from 'stellar-sdk';

import { Client } from '../../../clients';
import { Identifiable } from '../../interfaces';
import { Account } from './Account';

export interface Flags {
	/**
	 * If set to `true`, none of the account flags can be changed.
	 */
	authImmutable: boolean;

	/**
	 * If set to `true`, anyone who wants to hold an asset issued by the account must first be approved by the account.
	 */
	authRequired: boolean;

	/**
	 * If set to `true`, the account can freeze the balance of a holder of an asset issued by the account.
	 */
	authRevocable: boolean;
}

/**
 * Structure representing a Stellar Asset.
 */
export class Asset implements Identifiable<string> {
	/**
	 * The id of the asset.
	 */
	public id!: string;

	/**
	 * The asset type. Either `credit_alphanum4` or `credit_alphanum12`.
	 */
	public assetType!: AssetType.credit4 | AssetType.credit12;

	/**
	 * The asset code.
	 */
	public assetCode!: string;

	/**
	 * The Stellar address of the asset issuer.
	 */
	public assetIssuerId!: string;

	/**
	 * A cursor value for use in pagination.
	 */
	public pagingToken!: string;

	/**
	 * The amount of authorized units issued for the asset.
	 */
	public amount!: number;

	/**
	 * The number of accounts that have issued a trustline to the asset. If the `authRequired` flag for the asset issuer is set to `true`, this number only includes the accounts who have both set up a trustline to the asset and have been authorized to hold the asset.
	 */
	public accountCount!: number;

	/**
	 * Denote the enabling/disabling of certain asset issuer privileges.
	 */
	public flags!: Flags;

	public constructor(public readonly client: Client, data: ServerApi.AssetRecord) {
		this.$patch(data);
	}

	public $patch(data: ServerApi.AssetRecord): void {
		this.id = `${data.asset_code}:${data.asset_issuer}`;
		this.assetType = data.asset_type;
		this.assetCode = data.asset_code;
		this.assetIssuerId = data.asset_issuer;
		this.pagingToken = data.paging_token;
		this.amount = Number(data.amount);
		this.accountCount = data.num_accounts;
		this.flags = {
			authImmutable: data.flags.auth_immutable,
			authRequired: data.flags.auth_required,
			authRevocable: data.flags.auth_revocable,
		};
	}

	/**
	 * Get the asset issuer account.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the asset issuer account instead.
	 * @returns The account of the asset issuer.
	 */
	public getAssetIssuerAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.assetIssuerId, true, !forceUpdate);
	}
}
