import { ServerApi } from 'stellar-sdk';

import { StellarClient } from '../../clients';
import { Events } from '../Events';
import { BaseStream } from './BaseStream';

/**
 * Stream manager for Stellar trades.
 */
export class TradeStream extends BaseStream {
	public constructor(public readonly stellar: StellarClient) {
		super(stellar);
	}

	/**
	 * Handle new Stellar trades.
	 *
	 * @param trade - The received Stellar trade.
	 */
	private onMessage(trade: ServerApi.TradeRecord): void {
		const cachedTrade = this.stellar.trades.add(trade);

		this.stellar.emit(Events.Trade, cachedTrade);
	}

	/**
	 * Listen for new Stellar trades.
	 */
	public listen(): void {
		if (this._stop) {
			return;
		}

		let callBuilder = this.stellar.server.trades();

		if (this.stellar.account) {
			callBuilder = callBuilder.forAccount(this.stellar.account.publicKey());
		}

		this.stop = callBuilder.cursor('now').stream({
			onmessage: this.onMessage.bind(this) as unknown as (
				value: ServerApi.CollectionPage<ServerApi.TradeRecord>,
			) => void,
			onerror: this.onError.bind(this),
		});
	}
}
