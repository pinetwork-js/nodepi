import { Horizon, ServerApi } from 'stellar-sdk';

import { StellarClient } from '../../../clients';
import {
	AccountMergeOperation,
	AllowTrustOperation,
	BeginSponsoringFutureReservesOperation,
	BumpSequenceOperation,
	ChangeTrustOperation,
	ClaimClaimableBalanceOperation,
	CreateAccountOperation,
	CreateClaimableBalanceOperation,
	CreatePassiveSellOfferOperation,
	EndSponsoringFutureReservesOperation,
	ManageBuyOfferOperation,
	ManageDataOperation,
	ManageSellOfferOperation,
	PathPaymentReceiveOperation,
	PathPaymentSendOperation,
	PaymentOperation,
	RevokeSponsorshipOperation,
	SetOptionOperation,
} from '../../ressources/stellar/operations';
import { Operation } from '../../ressources/stellar/operations/Operation';
import { BaseManager, isPatchable } from '../BaseManager';

export class OperationManager<O extends Operation = Operation> extends BaseManager<typeof Operation> {
	public constructor(public readonly stellar: StellarClient, iterable?: (ServerApi.OperationRecord | O)[]) {
		super(stellar.client, Operation, iterable);
	}

	/**
	 * Adds the operation to the cache (or return the cached operation, if `cache` is true).
	 *
	 * @param data - The operation to add.
	 * @param cache - If the operation should be cached (or cached operation patched), `true` by default.
	 * @returns The resolved operation.
	 */
	public add(data: ServerApi.OperationRecord, cache = true): O {
		const existing = this.cache.get(data.id);

		if (existing) {
			if (cache && isPatchable(existing)) {
				existing.$patch(data);
			}

			return existing as O;
		}

		let entry;

		switch (data.type) {
			case Horizon.OperationResponseType.createAccount: {
				entry = new CreateAccountOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.payment: {
				entry = new PaymentOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.pathPayment: {
				entry = new PathPaymentReceiveOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.pathPaymentStrictSend: {
				entry = new PathPaymentSendOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.manageOffer: {
				entry = new ManageSellOfferOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.manageBuyOffer as Horizon.OperationResponseType.manageOffer: {
				entry = new ManageBuyOfferOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.createPassiveOffer: {
				entry = new CreatePassiveSellOfferOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.setOptions: {
				entry = new SetOptionOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.changeTrust: {
				entry = new ChangeTrustOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.allowTrust: {
				entry = new AllowTrustOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.accountMerge: {
				entry = new AccountMergeOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.manageData: {
				entry = new ManageDataOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.bumpSequence: {
				entry = new BumpSequenceOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.createClaimableBalance: {
				entry = new CreateClaimableBalanceOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.claimClaimableBalance: {
				entry = new ClaimClaimableBalanceOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.beginSponsoringFutureReserves: {
				entry = new BeginSponsoringFutureReservesOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.endSponsoringFutureReserves: {
				entry = new EndSponsoringFutureReservesOperation(this.client, data);

				break;
			}
			case Horizon.OperationResponseType.revokeSponsorship: {
				entry = new RevokeSponsorshipOperation(this.client, data);

				break;
			}
			default: {
				entry = new this.hold(this.client, data);
			}
		}

		if (cache) {
			this.cache.set(entry.id, entry);
		}

		return entry as O;
	}

	/**
	 * Fetch the operation by its id in the cache or from the Pi Network Stellar API.
	 *
	 * @param id - The operation id to fetch.
	 * @param cache - If the operation should be cached (or cached operation patched), `true` by default.
	 * @param checkCache - If the operation should be fetched in the cache, `true` by default.
	 * @returns The fetched operation.
	 */
	public async fetch(id: string, cache?: boolean, checkCache = true): Promise<O> {
		const existing = checkCache && this.cache.get(id);

		if (existing) {
			return existing as O;
		}

		const operation = await this.stellar.server.operations().operation(id).call();

		return this.add(operation, cache);
	}
}
