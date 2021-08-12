/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from '../../clients';
import { Identifiable, Patchable } from '../interfaces';

export function isPatchable(entry: Record<PropertyKey, any>): entry is Patchable {
	return '$patch' in entry;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface BaseManager<H, D, E, V, K> {
	/**
	 * Fetches the data from Pi Network APIs (or return the cached element, if `cache` is true).
	 *
	 * @param key - The data's key (id, etc.).
	 * @param cache - If the data should be cached (or cached data patched), `true` by default.
	 * @param checkCache - If the cached data should be returned (if it exists) rather than fetching the data, `true` by default.
	 * @returns The the fetched (or cached) data, or `undefined` if not found.
	 */
	fetch?(key: K, cache?: boolean, checkCache?: boolean): Promise<V | undefined>;
}

// eslint-disable-next-line no-redeclare
export abstract class BaseManager<
	H extends new (client: Client, data: any, ...args: any[]) => Identifiable<K>,
	D = H extends new (client: Client, data: infer R, ...args: any[]) => any ? R : never,
	E = H extends new (client: Client, data: any, ...args: infer R) => any ? R : never,
	V = H extends new (client: Client, data: any, ...args: any[]) => infer R ? R : never,
	K = V extends Identifiable<infer R> ? R : never,
> {
	/**
	 * The cache of the manager.
	 */
	public readonly cache = new Map<K, V>();

	public constructor(
		public readonly client: Client,
		protected readonly hold: H,
		iterable?: (D | V)[],
		protected readonly extras?: E,
	) {
		if (iterable) {
			for (const item of iterable) {
				this.add(item, true);
			}
		}
	}

	/**
	 * Adds the data to the cache (or return the cached element, if `cache` is true).
	 *
	 * @param data - The data to add.
	 * @param cache - If the data should be cached (or cached data patched), `true` by default.
	 * @returns The resolved data.
	 */
	public abstract add(data: D | V, cache: boolean): V;

	/**
	 * Resolves the data by its key from the cache.
	 *
	 * @param key - The data's key (id, etc.).
	 * @returns The cached data or `undefined` if not found.
	 */
	public resolve(key: K): V | undefined {
		return this.cache.get(key);
	}
}
