import { EffectType, SignerCreated } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Signer Created Effect.
 */
export class SignerCreatedEffect extends Effect<EffectTypeNames.signerCreated, EffectType.signer_created> {
	/**
	 * The numerical weight of the new signer.
	 */
	public weight!: number;

	/**
	 * The public key of the new signer.
	 */
	public publicKey!: string;

	public constructor(client: Client, data: SignerCreated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: SignerCreated): void {
		super.$patch(data);

		this.weight = data.weight;
		this.publicKey = data.public_key;
	}

	/**
	 * Get the account of the new signer.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the signer account instead.
	 * @returns The account of the new signer.
	 */
	public getSignerAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.publicKey, true, !forceUpdate);
	}
}
