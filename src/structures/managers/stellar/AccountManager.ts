import { ServerApi } from 'stellar-sdk';

import { StellarClient } from '../../../clients';
import { Account } from '../../ressources';
import { BaseManager, isPatchable } from '../BaseManager';

export class AccountManager extends BaseManager<typeof Account> {
	public constructor(public readonly stellar: StellarClient, iterable?: (ServerApi.AccountRecord | Account)[]) {
		super(stellar.client, Account, iterable);
	}

	/**
	 * Adds the account to the cache (or return the cached account, if `cache` is true).
	 *
	 * @param data - The account to add.
	 * @param cache - If the account should be cached (or cached account patched), `true` by default.
	 * @returns The resolved account.
	 */
	public add(data: ServerApi.AccountRecord, cache = true): Account {
		const existing = this.cache.get(data.id);

		if (existing) {
			if (cache && isPatchable(existing)) {
				existing.$patch(data);
			}

			return existing;
		}

		const entry = new this.hold(this.client, data);

		if (cache) {
			this.cache.set(entry.id, entry);
		}

		return entry;
	}

	/**
	 * Fetch the account by its id in the cache or from the Pi Network Stellar API.
	 *
	 * @param id - The account id to fetch.
	 * @param cache - If the account should be cached (or cached account patched), `true` by default.
	 * @param checkCache - If the account should be fetched in the cache, `true` by default.
	 * @returns The fetched account.
	 */
	public async fetch(id: string, cache?: boolean, checkCache = true): Promise<Account> {
		const existing = checkCache && this.cache.get(id);

		if (existing) {
			return existing;
		}

		const account = await this.stellar.server.accounts().accountId(id).call();

		return this.add(account, cache);
	}
}
