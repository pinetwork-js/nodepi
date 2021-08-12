/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClaimableBalanceClaimantCreated, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Asset } from '../Asset';
import { ClaimableBalance, deepPredicateChange, Predicate } from '../ClaimableBalance';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Claimable Balance Claimant Created Effect.
 */
export class ClaimableBalanceClaimantCreatedEffect extends Effect<
	EffectTypeNames.claimableBalanceClaimantCreated,
	EffectType.claimable_balance_claimant_created
> {
	/**
	 * The asset available to be claimed in the SEP-11 form `asset_code:issuing_address` or `native` (for Pi).
	 */
	public assetInfo!: string;

	/**
	 * The amount of asset that can be claimed.
	 */
	public amount!: number;

	/**
	 * The predicate of the claimant.
	 */
	public predicate!: Predicate;

	/**
	 * The id of the created claimable balance.
	 */
	public balanceId!: string;

	public constructor(client: Client, data: ClaimableBalanceClaimantCreated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ClaimableBalanceClaimantCreated): void {
		super.$patch(data);

		this.assetInfo = data.asset;
		this.amount = Number(data.amount);
		this.balanceId = (data as any).balance_id;
		this.predicate = deepPredicateChange((data as any).predicate);
	}

	/**
	 * Get the asset if it's not `native`.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the asset instead.
	 * @returns The asset if it's not `native`.
	 */
	public async getAsset(forceUpdate = false): Promise<Asset | undefined> {
		if (this.assetInfo === 'native') {
			return;
		}

		return this.client.stellar.assets.fetch(this.assetInfo, true, !forceUpdate);
	}

	/**
	 * Get the created claimable balance.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the claimable balance instead.
	 * @returns The created claimable balance.
	 */
	public getClaimableBalance(forceUpdate = false): Promise<ClaimableBalance> {
		return this.client.stellar.claimableBalances.fetch(this.balanceId, true, !forceUpdate);
	}
}
