import { ServerApi } from 'stellar-sdk';

import { StellarClient } from '../../clients';
import { isApplicationAccount } from '../../utils/isApplicationAccount';
import { Events } from '../Events';
import { BaseStream } from './BaseStream';

/**
 * Stream manager for Stellar accounts.
 */
export class AccountStream extends BaseStream {
	public constructor(public readonly stellar: StellarClient) {
		super(stellar);
	}

	/**
	 * Handle new Stellar accounts.
	 *
	 * @param account - The received Stellar account.
	 */
	private onMessage(account: ServerApi.AccountRecord): void {
		if (this.stellar.account && !isApplicationAccount(account, this.stellar.account.publicKey())) {
			return;
		}

		const cachedAccount = this.stellar.accounts.add(account);

		this.stellar.emit(Events.Account, cachedAccount);
	}

	/**
	 * Listen for new Stellar accounts.
	 */
	public listen(): void {
		if (this._stop) {
			return;
		}

		this.stop = this.stellar.server
			.accounts()
			.cursor('now')
			.stream({
				onmessage: this.onMessage.bind(this) as unknown as (
					value: ServerApi.CollectionPage<ServerApi.AccountRecord>,
				) => void,
				onerror: this.onError.bind(this),
			});
	}
}
