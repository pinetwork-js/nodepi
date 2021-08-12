import { EffectType, SignerSponsorshipCreated } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Signer Sponsorship Created Effect.
 */
export class SignerSponsorshipCreatedEffect extends Effect<
	EffectTypeNames.signerSponsorshipCreated,
	EffectType.signer_sponsorship_created
> {
	/**
	 * The id of the signer.
	 */
	public signerId!: string;

	/**
	 * The id of the new signer sponsor.
	 */
	public sponsorId!: string;

	public constructor(client: Client, data: SignerSponsorshipCreated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: SignerSponsorshipCreated): void {
		super.$patch(data);

		this.signerId = data.signer;
		this.sponsorId = data.sponsor;
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
	 * Get the new sponsor of the account.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the sponsor account instead.
	 * @returns The account of the new sponsor.
	 */
	public getSponsorAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.sponsorId, true, !forceUpdate);
	}
}
