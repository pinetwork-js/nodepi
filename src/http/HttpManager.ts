/* eslint-disable @typescript-eslint/no-explicit-any */
import { Agent as HttpsAgent } from 'https';
import { Route, RoutePayload, RouteResult } from '@pinetwork-js/api-typing';
import got, { Got, Headers, OptionsOfUnknownResponseBody } from 'got/dist/source';
import { Agent as Http2Agent } from 'http2-wrapper';

import { Client } from '../clients';
import { RequestHandler } from './RequestHandler';

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface RequestOptions {
	/**
	 * Additionnals headers for the request.
	 */
	headers?: Headers;

	/**
	 * Whether or not the Authorization header should be specified.
	 *
	 * @defaultValue true
	 */
	auth?: boolean;
}

export interface HttpOptions {
	/**
	 * The timeout of http requests, in milliseconds.
	 *
	 * @defaultValue 20000
	 */
	requestTimeout: number;

	/**
	 * The number of times to retry a failed http request.
	 *
	 * @defaultValue 2
	 */
	retryLimit: number;

	/**
	 * Whether or not HTTP/2 should be used instead of HTTP/1.1.
	 *
	 * @defaultValue true
	 */
	http2: boolean;

	/**
	 * Pi Network Platform API base URL.
	 *
	 * @defaultValue 'https://socialchain.app/'
	 */
	apiUrl: string;
}

type RequestOptionalParameters<T extends Route<any, void> = Route<any, void>> = RoutePayload<T> extends void
	? (payload: void, options: RequestOptions | void) => any
	: (payload: RoutePayload<T>, options: RequestOptions | void) => any;

type RequestReallyOptionalParameters<T extends Route<any, void> = Route<any, void>> =
	RequestOptionalParameters<T> extends (...optionalParameters: infer P) => any ? P : never;

/**
 * The http request manager.
 */
export class HttpManager {
	/**
	 * The got client to perform the http requests.
	 */
	public readonly gotClient: Got;

	public constructor(public readonly client: Client, public readonly options: HttpOptions) {
		this.gotClient = got.extend({
			prefixUrl: this.options.apiUrl,
			timeout: this.options.requestTimeout,
			http2: this.options.http2,
			agent: this.options.http2 ? { http2: new Http2Agent() } : { https: new HttpsAgent({ keepAlive: true }) },
			followRedirect: false,
			retry: 0,
		});
	}

	/**
	 * The Authorization header value.
	 */
	public get auth(): string {
		return `Key ${this.client.token}`;
	}

	/**
	 * Perform a http request.
	 *
	 * @param method - The method of the request.
	 * @param route  - The route of the request.
	 * @param optionalParameters - The optional parameters of the request.
	 * @returns The payload of the request if there is one.
	 */
	public request<T extends Route<any, any>>(
		method: Method,
		route: T,
		...optionalParameters: RequestReallyOptionalParameters<T>
	): Promise<RouteResult<T>> {
		const [payload, options] = optionalParameters as unknown as [RoutePayload<T> | void, RequestOptions | void];
		const dotOptions: OptionsOfUnknownResponseBody = {
			headers: {
				Authorization: (options && options.auth) ?? true ? this.auth : undefined,
				...((options && options.headers) || {}),
			},
			method,
			url: route,
		};

		if (payload) {
			dotOptions.json = payload;
		}

		const handler = new RequestHandler(this);

		return handler.push(dotOptions) as RouteResult<T>;
	}
}
