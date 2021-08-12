import merge from 'lodash.merge';

import { HttpManager, HttpOptions } from '../http';
import { PaymentManager } from '../structures/managers/platform/PaymentManager';
import { DeepPartial } from '../utils/types';
import { StellarClient, StellarOptions } from './StellarClient';

export interface ClientOptions {
	/**
	 * HTTP options for interacting with the Pi Network Platform API.
	 */
	http?: DeepPartial<HttpOptions>;

	/**
	 * Options for interacting with the Pi Network Stellar API.
	 */
	stellar?: DeepPartial<StellarOptions>;
}

const defaultOptions: HttpOptions = {
	requestTimeout: 20_000,
	retryLimit: 2,
	http2: true,
	apiUrl: 'https://socialchain.app/',
};

/**
 * The main client for interacting with the Pi Network Platform API.
 */
export class Client {
	/**
	 * The http request manager.
	 */
	public readonly http: HttpManager;

	/**
	 * The client for interacting with the Pi Network Stellar API.
	 */
	public readonly stellar: StellarClient;

	/**
	 * A manager for the Pi Network payments.
	 */
	public readonly payments: PaymentManager;

	public constructor(public readonly token: string, { http, stellar }: ClientOptions) {
		this.http = new HttpManager(this, http ? merge(defaultOptions, http) : defaultOptions);
		this.stellar = new StellarClient(this, stellar);

		this.payments = new PaymentManager(this);
	}
}
