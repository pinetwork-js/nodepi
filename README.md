# Nodepi

[![GitHub](https://img.shields.io/github/license/PiNetwork-js/nodepi)](https://github.com/PiNetwork-js/nodepi/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@pinetwork-js/nodepi?color=crimson&logo=npm)](https://www.npmjs.com/package/@pinetwork-js/nodepi)

A backend client for interacting with the Pi Network Platform and Stellar APIs.

## Installation

Install with [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com):

```sh
npm install @pinetwork-js/nodepi
yarn add @pinetwork-js/nodepi
```

## Example usage

```js
const { Client } = require('@pinetwork-js/nodepi');
```

```ts
// TypeScript or ESM support
import { Client } from '@pinetwork-js/nodepi';
```

To use the client, you need to instanciate it with your Pi Network Platform API key and other optional configuration options. If you want the Stellar client to filter just the events associated with the wallet of your application, you can specify its private key (or passphrase) in the optional configuration options.

```js
// With Stellar application wallet filter
const client = new Client('api-key', {
	stellar: {
		privateKey:
			'private-key',
	},
});

// Without Stellar application wallet filter
const client = new Client('api-key');

client.stellar.on('ready', () => {
	console.log('Nodepi is ready to be used!');
});
```

By default, the Stellar client does not listen to any events, but you can request to listen to any event in [this list](https://developers.stellar.org/api/introduction/streaming/) (beware though, the Pi Network blockchain API has a rate limit of 3600 requests per hour, or one request per second).

```js
// Request to listen only to new operations and transactions
const client = new Client('api-key', {
	stellar: {
		events: ['operations', 'transactions'],
	},
});

client.stellar.on('ready', () => {
	console.log('Nodepi is ready to be used!');
});

client.stellar.on('operation', (operation) => {
	console.log('New operation', operation)
});

client.stellar.on('transaction', (transaction) => {
	console.log('New transaction', transaction)
});
```

## Links

- [Documentation](https://pinetwork-js.github.io/nodepi)
- [GitHub](https://github.com/PiNetwork-js/nodepi)
- [NPM](https://www.npmjs.com/package/@pinetwork-js/nodepi)