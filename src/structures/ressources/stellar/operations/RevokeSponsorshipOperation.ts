import { Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Account, Data } from '../Account';
import { Asset } from '../Asset';
import { ClaimableBalance } from '../ClaimableBalance';
import { Offer } from '../Offer';
import { Operation } from './Operation';

/**
 * Structure representing a Stellar Revoke Sponsorship Operation.
 */
export class RevokeSponsorshipOperation extends Operation<
	Horizon.OperationResponseType.revokeSponsorship,
	Horizon.OperationResponseTypeI.revokeSponsorship
> {
	/**
	 * The id of the account which is no longer sponsored.
	 */
	public accountId?: string;

	/**
	 * The id of the claimable balance which is no longer sponsored.
	 */
	public claimableBalanceId?: string;

	/**
	 * The id of the account whose data entry is no longer sponsored.
	 */
	public dataAccountId?: string;

	/**
	 * The name of the data entry which is no longer sponsored.
	 */
	public dataName?: string;

	/**
	 * The id of the offer which is no longer sponsored.
	 */
	public offerId?: string;

	/**
	 * The id of the account whose trustline is no longer sponsored.
	 */
	public trustlineAccountId?: string;

	/**
	 * The asset id of the trustline which is no longer sponsored.
	 */
	public trustlineAsset?: string;

	/**
	 * The account id of the signer which is no longer sponsored.
	 */
	public signerAccountId?: string;

	/**
	 * The type of the signer which is no longer sponsored.
	 */
	public signerType?: string;

	public constructor(client: Client, data: ServerApi.RevokeSponsorshipOperationRecord) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ServerApi.RevokeSponsorshipOperationRecord): void {
		super.$patch(data);

		this.accountId = data.account_id;
		this.claimableBalanceId = data.claimable_balance_id;
		this.dataAccountId = data.data_account_id;
		this.dataName = data.data_name;
		this.offerId = data.offer_id;
		this.trustlineAccountId = data.trustline_account_id;
		this.trustlineAsset = data.trustline_asset;
		this.signerAccountId = data.signer_account_id;
		this.signerType = data.signer_key;
	}

	/**
	 * Get the account which is no longer sponsored if there is one.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the account instead.
	 * @returns The no longer sponsored account if there is one.
	 */
	public async getAccount(forceUpdate = false): Promise<Account | undefined> {
		if (!this.accountId) {
			return;
		}

		return this.client.stellar.accounts.fetch(this.accountId, true, !forceUpdate);
	}

	/**
	 * Get the claimable balance which is no longer sponsored if there is one.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the claimable balance instead.
	 * @returns The no longer sponsored claimable balance if there is one.
	 */
	public async getClaimableBalance(forceUpdate = false): Promise<ClaimableBalance | undefined> {
		if (!this.claimableBalanceId) {
			return;
		}

		return this.client.stellar.claimableBalances.fetch(this.claimableBalanceId, true, !forceUpdate);
	}

	/**
	 * Get the account whose data entry is no longer sponsored if there is one.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the data account instead.
	 * @returns The no longer sponsored data entry account if there is one.
	 */
	public async getDataAccount(forceUpdate = false): Promise<Account | undefined> {
		if (!this.dataAccountId) {
			return;
		}

		return this.client.stellar.accounts.fetch(this.dataAccountId, true, !forceUpdate);
	}

	/**
	 * Get the data entry of the account which is no longer sponsored if there is one.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the data account entry instead.
	 * @returns The no longer sponsored account data entry if there is one.
	 */
	public async getDataAccountEntry(forceUpdate = false): Promise<Data | undefined> {
		const account = await this.getDataAccount(forceUpdate);

		if (!account || !this.dataName) {
			return;
		}

		return account.getDataEntry(this.dataName, forceUpdate);
	}

	/**
	 * Get the offer which is no longer sponsored if there is one.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the offer instead.
	 * @returns The no longer sponsored offer if there is one.
	 */
	public async getOffer(forceUpdate = false): Promise<Offer | undefined> {
		if (!this.offerId) {
			return;
		}

		return this.client.stellar.offers.fetch(this.offerId, true, !forceUpdate);
	}

	/**
	 * Get the account whose trustline is no longer sponsored if there is one.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the trustline account instead.
	 * @returns The no longer sponsored trustline account if there is one.
	 */
	public async getTrustlineAccount(forceUpdate = false): Promise<Account | undefined> {
		if (!this.trustlineAccountId) {
			return;
		}

		return this.client.stellar.accounts.fetch(this.trustlineAccountId, true, !forceUpdate);
	}

	/**
	 * Get the asset of the trustline which is no longer sponsored if there is one.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the trustline asset instead.
	 * @returns The no longer sponsored trustline asset if there is one.
	 */
	public async getTrustlineAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (!this.trustlineAsset) {
			return;
		}

		return this.client.stellar.assets.fetch(this.trustlineAsset, true, !forceUpdate);
	}

	/**
	 * Get the account of the signer which is no longer sponsored if there is one.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the signer account instead.
	 * @returns The no longer sponsored signer account if there is one.
	 */
	public async getSignerAccount(forceUpdate = false): Promise<Account | undefined> {
		if (!this.signerAccountId) {
			return;
		}

		return this.client.stellar.accounts.fetch(this.signerAccountId, true, !forceUpdate);
	}
}
