import { EffectType, SignerSponsorshipUpdated } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Signer Sponsorship Updated Effect.
 */
export class SignerSponsorshipUpdatedEffect extends Effect<
	EffectTypeNames.signerSponsorshipUpdated,
	EffectType.signer_sponsorship_updated
> {
	/**
	 * The id of the signer.
	 */
	public signerId!: string;

	/**
	 * The id of the former signer sponsor.
	 */
	public formerSponsorId!: string;

	/**
	 * The id of the new signer sponsor.
	 */
	public newSponsorId!: string;

	public constructor(client: Client, data: SignerSponsorshipUpdated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: SignerSponsorshipUpdated): void {
		super.$patch(data);

		this.signerId = data.signer;
		this.formerSponsorId = data.former_sponsor;
		this.newSponsorId = data.new_sponsor;
	}

	/**
	 * Get the account of the signer.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the signer account instead.
	 * @returns The account of the signer.
	 */
	public getSignerAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.signerId, true, !forceUpdate);
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
