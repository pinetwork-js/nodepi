import { ServerApi } from 'stellar-sdk';

import { StellarClient } from '../../clients';
import { isApplicationLedger } from '../../utils/isApplicationLedger';
import { Events } from '../Events';
import { BaseStream } from './BaseStream';

/**
 * Stream manager for Stellar ledgers.
 */
export class LedgerStream extends BaseStream {
	public constructor(public readonly stellar: StellarClient) {
		super(stellar);
	}

	/**
	 * Handle new Stellar ledgers.
	 *
	 * @param ledger - The received Stellar ledger.
	 */
	private async onMessage(ledger: ServerApi.LedgerRecord): Promise<void> {
		if (this.stellar.account && !(await isApplicationLedger(ledger, this.stellar.account.publicKey()))) {
			return;
		}

		const cachedLedger = this.stellar.ledgers.add(ledger);

		this.stellar.emit(Events.Ledger, cachedLedger);
	}

	/**
	 * Listen for new Stellar ledgers.
	 */
	public listen(): void {
		if (this._stop) {
			return;
		}

		this.stop = this.stellar.server
			.ledgers()
			.cursor('now')
			.stream({
				onmessage: this.onMessage.bind(this) as unknown as (
					value: ServerApi.CollectionPage<ServerApi.LedgerRecord>,
				) => void,
				onerror: this.onError.bind(this),
			});
	}
}
