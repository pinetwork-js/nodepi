import { ServerApi } from 'stellar-sdk';

import { StellarClient } from '../../clients';
import { Events } from '../Events';
import { BaseStream } from './BaseStream';

/**
 * Stream manager for Stellar effects.
 */
export class EffectStream extends BaseStream {
	public constructor(public readonly stellar: StellarClient) {
		super(stellar);
	}

	/**
	 * Handle new Stellar effects.
	 *
	 * @param effect - The received Stellar effect.
	 */
	private onMessage(effect: ServerApi.EffectRecord): void {
		const cachedEffect = this.stellar.effects.add(effect);

		this.stellar.emit(Events.Effect, cachedEffect);
	}

	/**
	 * Listen for new Stellar effects.
	 */
	public listen(): void {
		if (this._stop) {
			return;
		}

		let callBuilder = this.stellar.server.effects();

		if (this.stellar.account) {
			callBuilder = callBuilder.forAccount(this.stellar.account.publicKey());
		}

		this.stop = callBuilder.cursor('now').stream({
			onmessage: this.onMessage.bind(this) as unknown as (
				value: ServerApi.CollectionPage<ServerApi.EffectRecord>,
			) => void,
			onerror: this.onError.bind(this),
		});
	}
}
