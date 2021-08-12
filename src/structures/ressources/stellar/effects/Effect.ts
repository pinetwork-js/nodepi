import { ServerApi } from 'stellar-sdk';
import { EffectType } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Identifiable } from '../../../interfaces';
import { Account } from '../Account';
import { TrustlineFlagsUpdated } from './TrustlineFlagsUpdatedEffect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Effect.
 */
export class Effect<TN extends EffectTypeNames = EffectTypeNames, T extends EffectType = EffectType>
	implements Identifiable<string>
{
	/**
	 * The id of the effect.
	 */
	public id!: string;

	/**
	 * A cursor value for use in pagination.
	 */
	public pagingToken!: string;

	/**
	 * The name of the effect type.
	 */
	public typeName!: TN;

	/**
	 * The numeric type of the effect.
	 */
	public type!: T;

	/**
	 * The account that originates the effect.
	 */
	public accountId!: string;

	/**
	 * The effect's creation date.
	 */
	public createdAt!: Date;

	/**
	 * The effect's creation timestamp.
	 */
	public createdTimestamp!: number;

	public constructor(public readonly client: Client, data: ServerApi.EffectRecord | TrustlineFlagsUpdated) {
		this.$patch(data);
	}

	public $patch(data: ServerApi.EffectRecord | TrustlineFlagsUpdated): void {
		this.id = data.id;
		this.pagingToken = data.paging_token;
		this.typeName = data.type as TN;
		this.type = data.type_i as T;
		this.accountId = data.account;
		this.createdAt = new Date(data.created_at);
		this.createdTimestamp = this.createdAt.getTime();
	}

	/**
	 * Get the account the effect belongs to.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the account instead.
	 * @returns The account the effect belongs to.
	 */
	public getAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.accountId, true, !forceUpdate);
	}
}
