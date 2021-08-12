import { StellarClient } from '../../clients';
import { Events } from '../Events';

/**
 * Stream manager for Stellar accounts.
 */
export abstract class BaseStream {
	protected _stop?: () => void;

	public constructor(public readonly stellar: StellarClient) {}

	/**
	 * Emit Stellar errors.
	 *
	 * @param error - The Stellar error.
	 */
	protected onError(error: MessageEvent): void {
		this.stellar.emit(Events.Error, error);
	}

	public abstract listen(): void;

	/**
	 * Stop the current stream if there is one.
	 */
	public stop(): void {
		if (!this._stop) {
			return;
		}

		this._stop();

		this._stop = undefined;
	}
}
