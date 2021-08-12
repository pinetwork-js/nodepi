import { AssetType, ServerApi } from 'stellar-sdk';

import { Client } from '../../../clients';
import { isApplicationOperation, isApplicationTransaction } from '../../../utils';
import { isApplicationEffect } from '../../../utils/isApplicationEffect';
import { isApplicationOffer } from '../../../utils/isApplicationOffer';
import { isApplicationTrade } from '../../../utils/isApplicationTrade';
import { Identifiable } from '../../interfaces';
import {
	AccountManager,
	AssetManager,
	OfferManager,
	OperationManager,
	TradeManager,
	TransactionManager,
} from '../../managers';
import { EffectManager } from '../../managers/stellar/EffectManager';
import { Flags } from './Asset';
import { Ledger } from './Ledger';
import { PaymentOperation } from './operations';

interface AccountThresholds {
	/**
	 * The weight required for a valid transaction including the Allow Trust and Bump Sequence operations.
	 */
	lowThreshold: number;

	/**
	 * The weight required for a valid transaction including the Create Account, Payment, Path Payment, Manage Buy Offer, Manage Sell Offer, Create Passive Sell Offer, Change Trust, Inflation, and Manage Data operations.
	 */
	medThreshold: number;

	/**
	 * The weight required for a valid transaction including the Account Merge and Set Options operations.
	 */
	highThreshold: number;
}

interface BalanceLineBase<T extends AssetType> {
	/**
	 * The number of units of an asset held by this account.
	 */
	balance: string;

	/**
	 * Either `native`, `credit_alphanum4`, or `credit_alphanum12`.
	 */
	assetType: T;

	/**
	 * The sum of all buy offers owned by the account for the asset.
	 */
	buyingLiabilities: string;

	/**
	 * The sum of all sell offers owned by the account for the asset.
	 */
	sellingLiabilities: string;
}

type BalanceLineNative = BalanceLineBase<AssetType.native>;

interface BalanceLineAsset<T extends AssetType.credit4 | AssetType.credit12 = AssetType.credit4 | AssetType.credit12>
	extends BalanceLineBase<T> {
	/**
	 * The maximum amount of the asset that the account is willing to accept. Specified when opening a trustline.
	 */
	limit: string;

	/**
	 * The code of the asset.
	 */
	assetCode: string;

	/**
	 * The Stellar address of the asset’s issuer.
	 */
	assetIssuerId: string;

	/**
	 * The id of the last ledger that included changes to the asset.
	 */
	lastModifiedLedger: number;

	/**
	 * Whether or not the issuer has authorized the account to perform transactions with its credit.
	 */
	isAuthorized: boolean;

	/**
	 * Whether or not the issuer has authorized the account to maintain and reduce liabilities for its credit.
	 */
	isAuthorizedToMaintainLiabilities: boolean;

	/**
	 * The account id of the sponsor who is paying the reserves for the trustline.
	 */
	sponsor?: string;
}

type BalanceLine<T extends AssetType = AssetType> = T extends AssetType.native
	? BalanceLineNative
	: T extends AssetType.credit4 | AssetType.credit12
	? BalanceLineAsset<T>
	: BalanceLineNative | BalanceLineAsset;

type AccountSignerHashType = 'ed25519_public_key' | 'sha256_hash' | 'preauth_tx';

interface AccountRecordSigners {
	/**
	 * The numerical weight of a signer. Used to determine if a transaction meets the `threshold` requirements.
	 */
	weight: number;

	/**
	 * A hash of characters dependent on the signer type.
	 */
	key: string;

	/**
	 * The type of hash for this signer. Either `ed25519_public_key`, `sha256_hash` or `preauth_tx`.
	 */
	type: AccountSignerHashType;
}

export type Data = Record<string, string>;

/**
 * Structure representing a Stellar Account.
 */
export class Account implements Identifiable<string> {
	/**
	 * The id of the account.
	 */
	public id!: string;

	/**
	 * A cursor value for use in pagination.
	 */
	public pagingToken!: string;

	/**
	 * The account’s public key encoded in a base32 string representation.
	 */
	public accountPublicKey!: string;

	/**
	 * The account’s current sequence number. For use when submitting this account’s next transaction.
	 */
	public sequence!: string;

	/**
	 * The number of subentries on the account.
	 */
	public subentryCount!: number;

	/**
	 * The domain that hosts the account’s `stellar.toml` file.
	 */
	public homeDomain?: string;

	/**
	 * The id of the last ledger that included changes to the account.
	 */
	public lastModifiedLedgerId!: number;

	/**
	 * The number of reserves sponsored by the account.
	 */
	public numSponsoring!: number;

	/**
	 * The number of reserves sponsored for the account.
	 */
	public numSponsored!: number;

	/**
	 * The account id of the sponsor who is paying the reserves for the account.
	 */
	public sponsorId?: string;

	/**
	 * The thresholds for different access levels, as well as the weight of the master key.
	 */
	public thresholds!: AccountThresholds;

	/**
	 * Denote the enabling/disabling of certain asset issuer privileges.
	 */
	public flags!: Flags;

	/**
	 * The assets held by the account.
	 */
	public balances!: BalanceLine[];

	/**
	 * The public keys and associated weights that can be used to authorize transactions for this account. Used for multi-sig.
	 */
	public signers!: AccountRecordSigners[];

	/**
	 * The account data.
	 */
	public data!: Data;

	/**
	 * Get the operations of the account.
	 */
	private $operations!: ServerApi.AccountRecord['operations'];

	/**
	 * Get the payment operations of the account.
	 */
	private $payments!: ServerApi.AccountRecord['payments'];

	/**
	 * Get the offers of the account.
	 */
	private $offers!: ServerApi.AccountRecord['offers'];

	/**
	 * Get the trades of the account.
	 */
	private $trades!: ServerApi.AccountRecord['trades'];

	/**
	 * Get the data of the account.
	 */
	private $data!: ServerApi.AccountRecord['data'];

	/**
	 * Get the effects of the account.
	 */
	private $effects!: ServerApi.AccountRecord['effects'];

	public constructor(public readonly client: Client, data: ServerApi.AccountRecord) {
		this.$patch(data);
	}

	public $patch(data: ServerApi.AccountRecord): void {
		this.id = data.id;
		this.pagingToken = data.paging_token;
		this.accountPublicKey = data.account_id;
		this.sequence = data.sequence;
		this.subentryCount = data.subentry_count;
		this.homeDomain = data.home_domain;
		this.lastModifiedLedgerId = data.last_modified_ledger;
		this.numSponsoring = data.num_sponsoring;
		this.numSponsored = data.num_sponsored;
		this.sponsorId = data.sponsor;
		this.thresholds = {
			lowThreshold: data.thresholds.low_threshold,
			medThreshold: data.thresholds.med_threshold,
			highThreshold: data.thresholds.high_threshold,
		};
		this.flags = {
			authImmutable: data.flags.auth_immutable,
			authRequired: data.flags.auth_required,
			authRevocable: data.flags.auth_revocable,
		};
		this.balances = data.balances.map((balance) => {
			return balance.asset_type === 'native'
				? {
						balance: balance.balance,
						assetType: balance.asset_type,
						buyingLiabilities: balance.buying_liabilities,
						sellingLiabilities: balance.selling_liabilities,
				  }
				: {
						balance: balance.balance,
						limit: balance.limit,
						assetType: balance.asset_type,
						assetCode: balance.asset_code,
						assetIssuerId: balance.asset_issuer,
						buyingLiabilities: balance.buying_liabilities,
						sellingLiabilities: balance.selling_liabilities,
						lastModifiedLedger: balance.last_modified_ledger,
						isAuthorized: balance.is_authorized,
						isAuthorizedToMaintainLiabilities: balance.is_authorized_to_maintain_liabilities,
						sponsor: balance.sponsor,
				  };
		});
		this.signers = data.signers.map((signer) => ({ ...signer, type: signer.type as AccountSignerHashType }));
		this.data = data.data_attr;

		this.$operations = data.operations;
		this.$payments = data.payments;
		this.$offers = data.offers;
		this.$trades = data.trades;
		this.$data = data.data;
		this.$effects = data.effects;
	}

	/**
	 * Get the operations of the account.
	 *
	 * @returns A manager for the account operations.
	 */
	public async getOperations(): Promise<OperationManager> {
		const operations = (await this.$operations()).records;

		for (const operation of operations) {
			if (this.client.stellar.account && !isApplicationOperation(operation, this.client.stellar.account.publicKey())) {
				continue;
			}

			this.client.stellar.operations.add(operation);
		}

		return new OperationManager(this.client.stellar, operations);
	}

	/**
	 * Get the payment operations of the account.
	 *
	 * @returns A manager for the account payment operations.
	 */
	public async getPayments(): Promise<OperationManager<PaymentOperation>> {
		const payments = (await this.$payments()).records;

		for (const payment of payments) {
			if (this.client.stellar.account && !isApplicationOperation(payment, this.client.stellar.account.publicKey())) {
				continue;
			}

			this.client.stellar.operations.add(payment);
		}

		return new OperationManager<PaymentOperation>(this.client.stellar, payments);
	}

	/**
	 * Get the offers of the account.
	 *
	 * @returns A manager for the account offers.
	 */
	public async getOffers(): Promise<OfferManager> {
		const offers = (await this.$offers()).records;

		for (const offer of offers) {
			if (this.client.stellar.account && !isApplicationOffer(offer, this.client.stellar.account.publicKey())) {
				continue;
			}

			this.client.stellar.offers.add(offer);
		}

		return new OfferManager(this.client.stellar, offers);
	}

	/**
	 * Get the trades of the account.
	 *
	 * @returns A manager for the account trades.
	 */
	public async getTrades(): Promise<TradeManager> {
		const trades = (await this.$trades()).records;

		for (const trade of trades) {
			if (
				this.client.stellar.account &&
				!(await isApplicationTrade.call(this.client.stellar, trade, this.client.stellar.account.publicKey()))
			) {
				continue;
			}

			this.client.stellar.trades.add(trade);
		}

		return new TradeManager(this.client.stellar, trades);
	}

	/**
	 * Get the trasactions of the account.
	 *
	 * @returns A manager for the account transactions.
	 */
	public async getTransactions(): Promise<TransactionManager> {
		const transactions = (await this.client.stellar.server.transactions().forAccount(this.id).call()).records;

		for (const transaction of transactions) {
			if (
				this.client.stellar.account &&
				!(await isApplicationTransaction(transaction, this.client.stellar.account.publicKey()))
			) {
				continue;
			}

			this.client.stellar.transactions.add(transaction);
		}

		return new TransactionManager(this.client.stellar, transactions);
	}

	/**
	 * Get the data entry of the account for the given key.
	 *
	 * @param key - The key of the data to retreive.
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the data entry instead.
	 * @returns The data entry.
	 */
	public async getDataEntry(key: string, forceUpdate = false): Promise<Data> {
		if (forceUpdate) {
			const data = await this.$data({ value: key });

			return { [key]: data.value };
		}

		return { [key]: this.data[key] };
	}

	/**
	 * Get the sponsor of the account if there is one.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the sponsor account instead.
	 * @returns The account of the sponsor if there is one.
	 */
	public async getSponsorAccount(forceUpdate = false): Promise<Account | undefined> {
		if (!this.sponsorId) {
			return;
		}

		return this.client.stellar.accounts.fetch(this.sponsorId, true, !forceUpdate);
	}

	/**
	 * Get the last ledger that included changes to the account.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the ledger instead.
	 * @returns The last ledger that included changes to the account.
	 */
	public getLastModifiedLedger(forceUpdate = false): Promise<Ledger> {
		return this.client.stellar.ledgers.fetch(this.lastModifiedLedgerId, true, !forceUpdate);
	}

	/**
	 * Get the signers of the account.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the signer accounts instead.
	 * @returns A manager for the account signers.
	 */
	public async getSigners(forceUpdate = false): Promise<AccountManager> {
		const signers = await Promise.all(
			this.signers.map((signer) => this.client.stellar.accounts.fetch(signer.key, true, !forceUpdate)),
		);

		return new AccountManager(this.client.stellar, signers);
	}

	/**
	 * Get the non-native assets of the account balance.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the balance assets instead.
	 * @returns A manager for the account balance assets.
	 */
	public async getBalanceAssets(forceUpdate = false): Promise<AssetManager> {
		const assets = await Promise.all(
			this.balances
				.filter((balance): balance is BalanceLineAsset => balance.assetType !== 'native')
				.map((balance) => {
					const assetId = `${balance.assetCode}:${balance.assetIssuerId}`;

					return this.client.stellar.assets.fetch(assetId, true, !forceUpdate);
				}),
		);

		return new AssetManager(this.client.stellar, assets);
	}

	/**
	 * Get the effects of the account.
	 *
	 * @returns A manager for the account effects.
	 */
	public async getEffects(): Promise<EffectManager> {
		const effects = (await this.$effects()).records;

		for (const effect of effects) {
			if (this.client.stellar.account && !isApplicationEffect(effect, this.client.stellar.account.publicKey())) {
				continue;
			}

			this.client.stellar.effects.add(effect);
		}

		return new EffectManager(this.client.stellar, effects);
	}
}
