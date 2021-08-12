import { EffectType, SignerSponsorshipRemoved } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Signer Sponsorship Removed Effect.
 */
export class SignerSponsorshipRemovedEffect extends Effect<
	EffectTypeNames.signerSponsorshipRemoved,
	EffectType.signer_sponsorship_removed
> {
	/**
	 * The id of the signer.
	 */
	public signerId!: string;

	/**
	 * The id of the former signer sponsor.
	 */
	public formerSponsorId!: string;

	public constructor(client: Client, data: SignerSponsorshipRemoved) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: SignerSponsorshipRemoved): void {
		super.$patch(data);

		this.signerId = data.signer;
		this.formerSponsorId = data.former_sponsor;
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
}
