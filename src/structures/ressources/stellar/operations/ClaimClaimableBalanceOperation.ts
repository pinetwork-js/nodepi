import { Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { ClaimableBalance } from '../ClaimableBalance';
import { Operation } from './Operation';

/**
 * Structure representing a Stellar Claim Claimable Balance Operation.
 */
export class ClaimClaimableBalanceOperation extends Operation<
	Horizon.OperationResponseType.claimClaimableBalance,
	Horizon.OperationResponseTypeI.claimClaimableBalance
> {
	/**
	 * The id of the claimable balance.
	 */
	public balanceId!: string;

	/**
	 * The id of the account which claimed the balance.
	 */
	public claimantId!: string;

	public constructor(client: Client, data: ServerApi.ClaimClaimableBalanceOperationRecord) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ServerApi.ClaimClaimableBalanceOperationRecord): void {
		super.$patch(data);

		this.balanceId = data.balance_id;
		this.claimantId = data.claimant;
	}

	/**
	 * Get the claimed balance.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the claimable balance instead.
	 * @returns The claimed balance.
	 */
	public getClaimableBalance(forceUpdate = false): Promise<ClaimableBalance> {
		return this.client.stellar.claimableBalances.fetch(this.balanceId, true, !forceUpdate);
	}

	/**
	 * Get the account which claimed the balance.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the claimant account instead.
	 * @returns The account of the claimant.
	 */
	public getClaimantAccount(forceUpdate = false): Promise<ClaimableBalance> {
		return this.client.stellar.claimableBalances.fetch(this.claimantId, true, !forceUpdate);
	}
}
