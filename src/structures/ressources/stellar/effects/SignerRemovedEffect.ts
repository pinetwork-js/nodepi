import { EffectType, SignerRemoved } from 'stellar-sdk/lib/types/effects';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Effect } from './Effect';
import { EffectTypeNames } from '.';

/**
 * Structure representing a Stellar Signer Removed Effect.
 */
export class SignerRemovedEffect extends Effect<EffectTypeNames.signerRemoved, EffectType.signer_removed> {
	/**
	 * The numerical weight of the removed signer.
	 */
	public weight!: number;

	/**
	 * The public key of the removed signer.
	 */
	public publicKey!: string;

	public constructor(client: Client, data: SignerRemoved) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: SignerRemoved): void {
		super.$patch(data);

		this.weight = data.weight;
		this.publicKey = data.public_key;
	}

	/**
	 * Get the account of the removed signer.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the signer account instead.
	 * @returns The account of the removed signer.
	 */
	public getSignerAccount(forceUpdate = false): Promise<Account> {
		return this.client.stellar.accounts.fetch(this.publicKey, true, !forceUpdate);
	}
}
