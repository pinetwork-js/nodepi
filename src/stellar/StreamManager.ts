import { StellarClient } from '../clients';
import {
	AccountStream,
	EffectStream,
	LedgerStream,
	OfferStream,
	OperationStream,
	PaymentStream,
	TradeStream,
	TransactionStream,
} from './streams';

export type StreamEvent =
	| 'ledgers'
	| 'transactions'
	| 'operations'
	| 'payments'
	| 'effects'
	| 'accounts'
	| 'offers'
	| 'trades'
	| 'all';

export class StreamManager {
	public ledgers: LedgerStream;
	public transactions: TransactionStream;
	public operations: OperationStream;
	public payments: PaymentStream;
	public effects: EffectStream;
	public accounts: AccountStream;
	public offers: OfferStream;
	public trades: TradeStream;

	public constructor(public readonly stellar: StellarClient) {
		this.ledgers = new LedgerStream(stellar);
		this.transactions = new TransactionStream(stellar);
		this.operations = new OperationStream(stellar);
		this.payments = new PaymentStream(stellar);
		this.effects = new EffectStream(stellar);
		this.accounts = new AccountStream(stellar);
		this.offers = new OfferStream(stellar);
		this.trades = new TradeStream(stellar);
	}

	public listen(event: StreamEvent): void {
		if (event === 'all') {
			this.ledgers.listen();
			this.transactions.listen();
			this.operations.listen();
			this.payments.listen();
			this.effects.listen();
			this.accounts.listen();
			this.offers.listen();
			this.trades.listen();
		} else {
			this[event].listen();
		}
	}

	public stop(event: StreamEvent): void {
		if (event === 'all') {
			this.ledgers.stop();
			this.transactions.stop();
			this.operations.stop();
			this.payments.stop();
			this.effects.stop();
			this.accounts.stop();
			this.offers.stop();
			this.trades.stop();
		} else {
			this[event].stop();
		}
	}
}
