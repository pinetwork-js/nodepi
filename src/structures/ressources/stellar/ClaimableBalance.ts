/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import { camelCase } from 'camel-case';
import { ServerApi } from 'stellar-sdk';

import { Client } from '../../../clients';
import { Identifiable } from '../../interfaces';
import { AccountManager } from '../../managers';
import { Account } from './Account';
import { Asset } from './Asset';
import { Ledger } from './Ledger';

export interface Predicate {
	/**
	 * If true it means this clause of the condition is always satisfied.
	 */
	unconditional?: boolean;

	/**
	 * This clause of the condition is satisfied if both of the two elements in the array are satisfied.
	 */
	and?: Predicate[];

	/**
	 * This clause of the condition is satisfied if at least one of the two elements in the array are satisfied.
	 */
	or?: Predicate[];

	/**
	 * This clause of the condition is satisfied if the value is not satisfied.
	 */
	not?: Predicate;

	/**
	 * A date representing a deadline for when the claimable balance can be claimed. If the balance is claimed before the date then this clause of the condition is satisfied.
	 */
	absBefore?: string;

	/**
	 * A relative deadline for when the claimable balance can be claimed. The value represents the number of seconds since the close time of the ledger which created the claimable balance.
	 */
	relBefore?: string;
}

export interface Claimant {
	/**
	 * The id of the account  who can claim the balance.
	 */
	destination: string;

	/**
	 * The condition which must be satisfied so destination can claim the balance.
	 */
	predicate: Predicate;
}

export function deepPredicateChange(item: any): Predicate {
	if (Array.isArray(item)) {
		return item.map((deepItem) => deepPredicateChange(deepItem)) as Predicate;
	} else {
		const keys = Object.keys(item);

		for (const key of keys) {
			if (key.includes('_')) {
				const value = item[key];
				const newKey = camelCase(key);

				delete item[key];

				item[newKey] = newKey === 'absBefore' ? new Date(value) : value;
			}
		}

		return item;
	}
}

/**
 * Structure representing a Stellar Claimable Balance.
 */
export class ClaimableBalance implements Identifiable<string> {
	/**
	 * The id of the claimable balance.
	 */
	public id!: string;

	/**
	 * A cursor value for use in pagination.
	 */
	public pagingToken!: string;

	/**
	 * The asset available to be claimed in the SEP-11 form `asset_code:issuing_address` or `native` (for Pi).
	 */
	public assetInfo!: string;

	/**
	 * The amount of asset that can be claimed.
	 */
	public amount!: number;

	/**
	 * The account id of the sponsor who is paying the reserves for the claimable balance.
	 */
	public sponsorId?: string;

	/**
	 * The sequence number of the last ledger in which the claimable balance was modified.
	 */
	public lastModifiedLedgerId!: number;

	/**
	 * The date when the claimable balance was modified for the last time.
	 */
	public lastModifiedAt!: Date;

	/**
	 * The timestamp when the claimable balance was modified for the last time.
	 */
	public lastModifiedTimestamp!: number;

	/**
	 * The list of entries which could claim the claimable balance.
	 */
	public claimants!: Claimant[];

	public constructor(public readonly client: Client, data: ServerApi.ClaimableBalanceRecord) {
		this.$patch(data);
	}

	public $patch(data: ServerApi.ClaimableBalanceRecord): void {
		this.id = data.id;
		this.pagingToken = data.paging_token;
		this.assetInfo = data.asset;
		this.amount = Number(data.amount);
		this.sponsorId = data.sponsor;
		this.lastModifiedLedgerId = data.last_modified_ledger;
		this.lastModifiedAt = new Date((data as any).last_modified_time);
		this.claimants = data.claimants.map((claimant) => ({
			destination: claimant.destination,
			predicate: deepPredicateChange(claimant.predicate),
		}));
	}

	/**
	 * Get the sponsor of the claimable balance if there is one.
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
	 * Get the last ledger that included changes to the claimable balance.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the ledger instead.
	 * @returns The last ledger that included changes to the claimable balance.
	 */
	public getLastModifiedLedger(forceUpdate = false): Promise<Ledger> {
		return this.client.stellar.ledgers.fetch(this.lastModifiedLedgerId, true, !forceUpdate);
	}

	/**
	 * Get the claimants account of the claimable balance.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the claimants account instead.
	 * @returns A Map that contains claimants account mapped by their id.
	 */
	public async getClaimants(forceUpdate = false): Promise<AccountManager> {
		const claimants = await Promise.all(
			this.claimants.map((claimant) => this.client.stellar.accounts.fetch(claimant.destination, true, !forceUpdate)),
		);

		return new AccountManager(this.client.stellar, claimants);
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
}
