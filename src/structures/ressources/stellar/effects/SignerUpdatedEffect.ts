import { EffectType, SignerUpdated } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Signer Updated Effect.
 */
export class SignerUpdatedEffect extends Effect<EffectTypeNames.signerUpdated, EffectType.signer_updated> {
	/**
	 * The updated numerical weight of the signer.
	 */
	public weight!: number;

	/**
	 * The public key of the signer.
	 */
	public publicKey!: string;

	public constructor(client: Client, data: SignerUpdated) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: SignerUpdated): void {
		super.$patch(data);

		this.weight = data.weight;
		this.publicKey = data.public_key;
	}

	/**
	 * Get the account of the updated signer.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the signer account instead.
	 * @returns The account of the updated signer.
	 */
	public getSignerAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.publicKey, true, !forceUpdate);
	}
}
