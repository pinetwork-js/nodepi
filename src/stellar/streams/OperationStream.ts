import { ServerApi } from 'stellar-sdk';

import { StellarClient } from '../../clients';
import { Events } from '../Events';
import { BaseStream } from './BaseStream';

/**
 * Stream manager for Stellar operations.
 */
export class OperationStream extends BaseStream {
	public constructor(public readonly stellar: StellarClient) {
		super(stellar);
	}

	/**
	 * Handle new Stellar operations.
	 *
	 * @param operation - The received Stellar operation.
	 */
	private onMessage(operation: ServerApi.OperationRecord): void {
		const cachedOperation = this.stellar.operations.add(operation);

		this.stellar.emit(Events.Operation, cachedOperation);
	}

	/**
	 * Listen for new Stellar operations.
	 */
	public listen(): void {
		if (this._stop) {
			return;
		}

		let callBuilder = this.stellar.server.operations();

		if (this.stellar.account) {
			callBuilder = callBuilder.forAccount(this.stellar.account.publicKey());
		}

		this.stop = callBuilder.cursor('now').stream({
			onmessage: this.onMessage.bind(this) as unknown as (
				value: ServerApi.CollectionPage<ServerApi.OperationRecord>,
			) => void,
			onerror: this.onError.bind(this),
		});
	}
}
