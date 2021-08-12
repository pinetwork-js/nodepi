import { ServerApi } from 'stellar-sdk';

import { StellarClient } from '../../clients';
import { Events } from '../Events';
import { BaseStream } from './BaseStream';

/**
 * Stream manager for Stellar offers.
 */
export class OfferStream extends BaseStream {
	public constructor(public readonly stellar: StellarClient) {
		super(stellar);
	}

	/**
	 * Handle new Stellar offers.
	 *
	 * @param offer - The received Stellar offer.
	 */
	private onMessage(offer: ServerApi.OfferRecord): void {
		const cachedOffer = this.stellar.offers.add(offer);

		this.stellar.emit(Events.Offer, cachedOffer);
	}

	/**
	 * Listen for new Stellar offers.
	 */
	public listen(): void {
		if (this._stop) {
			return;
		}

		let callBuilder = this.stellar.server.offers();

		if (this.stellar.account) {
			callBuilder = callBuilder.forAccount(this.stellar.account.publicKey());
		}

		this.stop = callBuilder.cursor('now').stream({
			onmessage: this.onMessage.bind(this) as unknown as (
				value: ServerApi.CollectionPage<ServerApi.OfferRecord>,
			) => void,
			onerror: this.onError.bind(this),
		});
	}
}
