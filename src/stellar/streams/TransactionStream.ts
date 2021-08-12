import { ServerApi } from 'stellar-sdk';

import { StellarClient } from '../../clients';
import { Events } from '../Events';
import { BaseStream } from './BaseStream';

/**
 * Stream manager for Stellar transactions.
 */
export class TransactionStream extends BaseStream {
	public constructor(public readonly stellar: StellarClient) {
		super(stellar);
	}

	/**
	 * Handle new Stellar transactions.
	 *
	 * @param transaction - The received Stellar transaction.
	 */
	private onMessage(transaction: ServerApi.TransactionRecord): void {
		const cachedTransaction = this.stellar.transactions.add(transaction);

		this.stellar.emit(Events.Transaction, cachedTransaction);
	}

	/**
	 * Listen for new Stellar transactions.
	 */
	public listen(): void {
		if (this._stop) {
			return;
		}

		let callBuilder = this.stellar.server.transactions();

		if (this.stellar.account) {
			callBuilder = callBuilder.forAccount(this.stellar.account.publicKey());
		}

		this.stop = callBuilder.cursor('now').stream({
			onmessage: this.onMessage.bind(this) as unknown as (
				value: ServerApi.CollectionPage<ServerApi.TransactionRecord>,
			) => void,
			onerror: this.onError.bind(this),
		});
	}
}
