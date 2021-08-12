import { ServerApi } from 'stellar-sdk';

import { StellarClient } from '../../clients';
import { Events } from '../Events';
import { BaseStream } from './BaseStream';

/**
 * Stream manager for Stellar payment operations.
 */
export class PaymentStream extends BaseStream {
	public constructor(public readonly stellar: StellarClient) {
		super(stellar);
	}

	/**
	 * Handle new Stellar payment operations.
	 *
	 * @param payment - The received Stellar payment operation.
	 */
	private onMessage(payment: ServerApi.PaymentOperationRecord): void {
		const cachedPayment = this.stellar.operations.add(payment);

		this.stellar.emit(Events.Payment, cachedPayment);
	}

	/**
	 * Listen for new Stellar payment operations.
	 */
	public listen(): void {
		if (this._stop) {
			return;
		}

		let callBuilder = this.stellar.server.payments();

		if (this.stellar.account) {
			callBuilder = callBuilder.forAccount(this.stellar.account.publicKey());
		}

		this.stop = callBuilder.cursor('now').stream({
			onmessage: this.onMessage.bind(this) as unknown as (
				value: ServerApi.CollectionPage<ServerApi.PaymentOperationRecord>,
			) => void,
			onerror: this.onError.bind(this),
		});
	}
}
