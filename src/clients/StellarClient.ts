import EventEmitter from 'events';
import { mnemonicToSeed } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import merge from 'lodash.merge';
import { Config, Keypair, Server } from 'stellar-sdk';

import { StreamEvent, StreamManager } from '../stellar';
import { Events } from '../stellar/Events';
import {
	AccountManager,
	AssetManager,
	ClaimableBalanceManager,
	LedgerManager,
	OfferManager,
	OperationManager,
	TradeManager,
	TransactionManager,
} from '../structures/managers';
import {
	Account,
	Ledger,
	Operation,
	PaymentOperation,
	Transaction,
	Offer,
	Trade,
	Effect,
} from '../structures/ressources';
import { DeepPartial } from '../utils/types';
import { EffectManager } from '../structures/managers/stellar/EffectManager';
import { Client } from './Client';

interface ClientEvents extends Record<Events, readonly unknown[]> {
	ledger: [Ledger];
	transaction: [Transaction];
	operation: [Operation];
	payment: [PaymentOperation];
	effect: [Effect];
	account: [Account];
	offer: [Offer];
	trade: [Trade];
	stellarError: [MessageEvent];
	ready: [];
}

export interface StellarClient extends EventEmitter {
	on<K extends keyof ClientEvents>(eventName: K, listener: (...args: ClientEvents[K]) => void): this;
	on(eventName: string | symbol, listener: (...args: unknown[]) => void): this;

	addListener<K extends keyof ClientEvents>(eventName: K, listener: (...args: ClientEvents[K]) => void): this;
	addListener(eventName: string | symbol, listener: (...args: unknown[]) => void): this;

	prependListener<K extends keyof ClientEvents>(eventName: K, listener: (...args: ClientEvents[K]) => void): this;
	prependListener(eventName: string | symbol, listener: (...args: unknown[]) => void): this;

	once<K extends keyof ClientEvents>(eventName: K, listener: (...args: ClientEvents[K]) => void): this;
	once(eventName: string | symbol, listener: (...args: unknown[]) => void): this;

	prependOnceListener<K extends keyof ClientEvents>(eventName: K, listener: (...args: ClientEvents[K]) => void): this;
	prependOnceListener(eventName: string | symbol, listener: (...args: unknown[]) => void): this;

	emit<K extends keyof ClientEvents>(eventName: K, ...args: ClientEvents[K]): boolean;
	emit(eventName: string | symbol, ...args: unknown[]): boolean;

	off<K extends keyof ClientEvents>(eventName: K, listener: (...args: ClientEvents[K]) => void): this;
	off(eventName: string | symbol, listener: (...args: unknown[]) => void): this;

	removeListener<K extends keyof ClientEvents>(eventName: K, listener: (...args: ClientEvents[K]) => void): this;
	removeListener(eventName: string | symbol, listener: (...args: unknown[]) => void): this;

	removeAllListeners<K extends keyof ClientEvents>(eventName?: K): this;
	removeAllListeners(eventName?: string | symbol): this;

	listeners<K extends keyof ClientEvents>(eventName: K): ((...args: ClientEvents[K]) => void)[];
	listeners(eventName: string | symbol): ((...args: unknown[]) => void)[];

	listenerCount<K extends keyof ClientEvents>(eventName: K): number;
	listenerCount(eventName: string | symbol): number;
}

export interface StellarOptions {
	server?: Server.Options;

	/**
	 * The timeout of requests, in milliseconds.
	 *
	 * @defaultValue 20000
	 */
	requestTimeout: number;

	/**
	 * Pi Network Stellar API base URL.
	 *
	 * @defaultValue 'https://api.testnet.minepi.com'
	 */
	apiUrl: string;

	/**
	 * A list of stellar event to listen to.
	 *
	 * @defaultValue []
	 */
	events: StreamEvent[];

	privateKey?: string;
}

const defaultOptions: StellarOptions = {
	requestTimeout: 20_000,
	apiUrl: 'https://api.testnet.minepi.com',
	events: [],
};

// eslint-disable-next-line no-redeclare
export class StellarClient extends EventEmitter {
	/**
	 * The Stellar server.
	 */
	public server!: Server;

	/**
	 * The application keypair if provided in the options.
	 */
	public account?: Keypair;

	/**
	 * A manager for the Stellar accounts.
	 */
	public accounts!: AccountManager;

	/**
	 * A manager for the Stellar assets.
	 */
	public assets!: AssetManager;

	/**
	 * A manager for the Stellar claimable balances.
	 */
	public claimableBalances!: ClaimableBalanceManager;

	/**
	 * A manager for the Stellar effects.
	 */
	public effects!: EffectManager;

	/**
	 * A manager for the Stellar ledgers.
	 */
	public ledgers!: LedgerManager;

	/**
	 * A manager for the Stellar offers.
	 */
	public offers!: OfferManager;

	/**
	 * A manager for the Stellar operations.
	 */
	public operations!: OperationManager;

	/**
	 * A manager for the Stellar trades.
	 */
	public trades!: TradeManager;

	/**
	 * A manager for the Stellar transactions.
	 */
	public transactions!: TransactionManager;

	/**
	 * A manager for the stream events.
	 */
	public streams!: StreamManager;

	public constructor(public readonly client: Client, config: DeepPartial<StellarOptions> = defaultOptions) {
		super();

		this.configure(config);
	}

	private async configure(config: DeepPartial<StellarOptions> = defaultOptions): Promise<void> {
		const options = merge(defaultOptions, config);

		this.server = new Server(options.apiUrl, options.server);
		Config.setTimeout(options.requestTimeout);

		if (options.privateKey) {
			if (options.privateKey.split(' ').length === 24) {
				await this.registerWithMnemonic(options.privateKey);
			} else {
				this.account = Keypair.fromSecret(options.privateKey);
			}
		}

		this.accounts = new AccountManager(this);
		this.assets = new AssetManager(this);
		this.claimableBalances = new ClaimableBalanceManager(this);
		this.effects = new EffectManager(this);
		this.ledgers = new LedgerManager(this);
		this.offers = new OfferManager(this);
		this.operations = new OperationManager(this);
		this.trades = new TradeManager(this);
		this.transactions = new TransactionManager(this);
		this.streams = new StreamManager(this);

		const events = config.events
			? config.events.filter<StreamEvent>((event): event is StreamEvent => Boolean(event))
			: defaultOptions.events;

		for (const event of events) {
			this.streams.listen(event);
		}

		this.emit(Events.Ready);
	}

	private async registerWithMnemonic(mnemonic: string): Promise<void> {
		const seed = await mnemonicToSeed(mnemonic);
		const derivedSeed = derivePath("m/44'/314159'/0'", seed.toString('hex'));

		this.account = Keypair.fromRawEd25519Seed(derivedSeed.key);
	}
}
