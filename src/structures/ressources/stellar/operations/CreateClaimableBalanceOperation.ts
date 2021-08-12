import { Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Asset } from '../Asset';
import { Claimant, deepPredicateChange } from '../ClaimableBalance';
import { Operation } from './Operation';

/**
 * Structure representing a Stellar Create Claimable Balance Operation.
 */
export class CreateClaimableBalanceOperation extends Operation<
	Horizon.OperationResponseType.createClaimableBalance,
	Horizon.OperationResponseTypeI.createClaimableBalance
> {
	/**
	 * The asset available to be claimed in the SEP-11 form `asset_code:issuing_address` or `native` (for Pi).
	 */
	public assetInfo!: string;

	/**
	 * The amount available to be claimed.
	 */
	public amount!: number;

	/**
	 * The account id of the sponsor who is paying the reserves for the claimable balance.
	 */
	public sponsorId!: string;

	/**
	 * The list of entries which could claim the claimable balance.
	 */
	public claimants!: Claimant[];

	public constructor(client: Client, data: ServerApi.CreateClaimableBalanceOperationRecord) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ServerApi.CreateClaimableBalanceOperationRecord): void {
		super.$patch(data);

		this.assetInfo = data.asset;
		this.amount = Number(data.amount);
		this.sponsorId = data.sponsor;
		this.claimants = data.claimants.map((claimant) => ({
			destination: claimant.destination,
			predicate: deepPredicateChange(claimant.predicate),
		}));
	}

	/**
	 * Get the asset of the claimable balance if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the asset instead.
	 * @returns The asset of the claimable balance if it's not `native`.
	 */
	public async getAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.assetInfo === 'native') {
			return;
		}

		return this.client.stellar.assets.fetch(this.assetInfo, true, !forceUpdate);
	}

	/**
	 * Get the account of the sponsor who is paying the reserves for the claimable balance.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the sponsor account instead.
	 * @returns The account of the sponsor.
	 */
	public getSponsorAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.sponsorId, true, !forceUpdate);
	}
}
