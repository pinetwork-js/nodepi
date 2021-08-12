import { DateSponsorshipUpdated as DataSponsorshipUpdated, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account, Data } from '../Account';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Data Sponsorship Updated Effect.
 */
export class DataSponsorshipUpdatedEffect extends Effect<
	EffectTypeNames.dataSponsorshipUpdated,
	EffectType.data_sponsorship_updated
> {
	/**
	 * The name of the data entry.
	 */
	public dataName!: string;

	/**
	 * The id of the former data sponsor.
	 */
	public formerSponsorId!: string;

	/**
	 * The id of the new data sponsor.
	 */
	public newSponsorId!: string;

	public constructor(client: Client, data: DataSponsorshipUpdated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: DataSponsorshipUpdated): void {
		super.$patch(data);

		this.dataName = data.data_name;
		this.formerSponsorId = data.former_sponsor;
		this.newSponsorId = data.new_sponsor;
	}

	/**
	 * Get the data entry of the account.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the data account entry instead.
	 * @returns The data entry of the account.
	 */
	public async getDataAccountEntry(forceUpdate = false): Promise<Data> {
		const account = await this.getAccount();

		return account.getDataEntry(this.dataName, forceUpdate);
	}

	/**
	 * Get the former sponsor of the account.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the former sponsor account instead.
	 * @returns The account of the former sponsor.
	 */
	public getFormerSponsorAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.formerSponsorId, true, !forceUpdate);
	}

	/**
	 * Get the new sponsor of the account.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the new sponsor account instead.
	 * @returns The account of the new sponsor.
	 */
	public getNewSponsorAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.newSponsorId, true, !forceUpdate);
	}
}
