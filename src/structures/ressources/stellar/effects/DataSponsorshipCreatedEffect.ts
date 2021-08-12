import { DateSponsorshipCreated as DataSponsorshipCreated, EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account, Data } from '../Account';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Data Sponsorship Created Effect.
 */
export class DataSponsorshipCreatedEffect extends Effect<
	EffectTypeNames.dataSponsorshipCreated,
	EffectType.data_sponsorship_created
> {
	/**
	 * The name of the data entry.
	 */
	public dataName!: string;

	/**
	 * The id of the new data sponsor.
	 */
	public sponsorId!: string;

	public constructor(client: Client, data: DataSponsorshipCreated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: DataSponsorshipCreated): void {
		super.$patch(data);

		this.dataName = data.data_name;
		this.sponsorId = data.sponsor;
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
	 * Get the new sponsor of the account.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the sponsor account instead.
	 * @returns The account of the new sponsor.
	 */
	public getSponsorAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.sponsorId, true, !forceUpdate);
	}
}
