import { ServerApi } from 'stellar-sdk';
import {
	AccountCreated,
	AccountCredited,
	AccountDebited,
	AccountFlagsUpdated,
	AccountHomeDomainUpdated,
	AccountSponsorshipCreated,
	AccountSponsorshipRemoved,
	AccountSponsorshipUpdated,
	AccountThresholdsUpdated,
	ClaimableBalanceClaimantCreated,
	ClaimableBalanceClaimed,
	ClaimableBalanceCreated,
	ClaimableBalanceSponsorshipCreated,
	ClaimableBalanceSponsorshipRemoved,
	ClaimableBalanceSponsorshipUpdated,
	DataCreated,
	DataRemoved,
	DataUpdated,
	DateSponsorshipCreated,
	DateSponsorshipRemoved,
	DateSponsorshipUpdated,
	SequenceBumped,
	SignerCreated,
	SignerRemoved,
	SignerSponsorshipCreated,
	SignerSponsorshipRemoved,
	SignerSponsorshipUpdated,
	SignerUpdated,
	TrustlineAuthorized,
	TrustlineAuthorizedToMaintainLiabilities,
	TrustlineCreated,
	TrustlineDeauthorized,
	TrustlineRemoved,
	TrustlineSponsorshipCreated,
	TrustlineSponsorshipRemoved,
	TrustlineSponsorshipUpdated,
	TrustlineUpdated,
} from 'stellar-sdk/lib/types/effects';
import { Trade } from 'stellar-sdk/lib/types/trade';

import { StellarClient } from '../../../clients';
import {
	AccountCreatedEffect,
	AccountCreditedEffect,
	AccountDebitedEffect,
	AccountFlagsUpdatedEffect,
	AccountHomeDomainUpdatedEffect,
	AccountSponsorshipCreatedEffect,
	AccountSponsorshipRemovedEffect,
	AccountSponsorshipUpdatedEffect,
	AccountThresholdsUpdatedEffect,
	ClaimableBalanceClaimantCreatedEffect,
	ClaimableBalanceClaimedEffect,
	ClaimableBalanceCreatedEffect,
	ClaimableBalanceSponsorshipCreatedEffect,
	ClaimableBalanceSponsorshipRemovedEffect,
	ClaimableBalanceSponsorshipUpdatedEffect,
	DataCreatedEffect,
	DataRemovedEffect,
	DataSponsorshipCreatedEffect,
	DataSponsorshipRemovedEffect,
	DataSponsorshipUpdatedEffect,
	DataUpdatedEffect,
	Effect,
	EffectTypeNames,
	SequenceBumpedEffect,
	SignerCreatedEffect,
	SignerRemovedEffect,
	SignerSponsorshipCreatedEffect,
	SignerSponsorshipRemovedEffect,
	SignerSponsorshipUpdatedEffect,
	SignerUpdatedEffect,
	TradeEffect,
	TrustlineAuthorizedEffect,
	TrustlineAuthorizedToMaintainLiabilitiesEffect,
	TrustlineCreatedEffect,
	TrustlineDeauthorizedEffect,
	TrustlineFlagsUpdated,
	TrustlineFlagsUpdatedEffect,
	TrustlineRemovedEffect,
	TrustlineSponsorshipCreatedEffect,
	TrustlineSponsorshipRemovedEffect,
	TrustlineSponsorshipUpdatedEffect,
	TrustlineUpdatedEffect,
} from '../../ressources';
import { BaseManager, isPatchable } from '../BaseManager';

export class EffectManager<E extends Effect = Effect> extends BaseManager<typeof Effect> {
	public constructor(public readonly stellar: StellarClient, iterable?: (ServerApi.EffectRecord | E)[]) {
		super(stellar.client, Effect, iterable);
	}

	/**
	 * Adds the effect to the cache (or return the cached effect, if `cache` is true).
	 *
	 * @param data - The effect to add.
	 * @param cache - If the effect should be cached (or cached effect patched), `true` by default.
	 * @returns The resolved effect.
	 */
	public add(data: ServerApi.EffectRecord, cache = true): E {
		const existing = this.cache.get(data.id);

		if (existing) {
			if (cache && isPatchable(existing)) {
				existing.$patch(data);
			}

			return existing as E;
		}

		let entry;

		// eslint-disable-next-line sonarjs/max-switch-cases
		switch (data.type) {
			case EffectTypeNames.accountCreated: {
				entry = new AccountCreatedEffect(this.client, data as AccountCreated);

				break;
			}
			case EffectTypeNames.accountCredited: {
				entry = new AccountCreditedEffect(this.client, data as AccountCredited);

				break;
			}
			case EffectTypeNames.accountDebited: {
				entry = new AccountDebitedEffect(this.client, data as AccountDebited);

				break;
			}
			case EffectTypeNames.accountFlagsUpdated: {
				entry = new AccountFlagsUpdatedEffect(this.client, data as AccountFlagsUpdated);

				break;
			}
			case EffectTypeNames.accountHomeDomainUpdated: {
				entry = new AccountHomeDomainUpdatedEffect(this.client, data as AccountHomeDomainUpdated);

				break;
			}
			case EffectTypeNames.accountSponsorshipCreated: {
				entry = new AccountSponsorshipCreatedEffect(this.client, data as AccountSponsorshipCreated);

				break;
			}
			case EffectTypeNames.accountSponsorshipRemoved: {
				entry = new AccountSponsorshipRemovedEffect(this.client, data as AccountSponsorshipRemoved);

				break;
			}
			case EffectTypeNames.accountSponsorshipUpdated: {
				entry = new AccountSponsorshipUpdatedEffect(this.client, data as AccountSponsorshipUpdated);

				break;
			}
			case EffectTypeNames.accountThresholdsUpdated: {
				entry = new AccountThresholdsUpdatedEffect(this.client, data as AccountThresholdsUpdated);

				break;
			}
			case EffectTypeNames.claimableBalanceClaimantCreated: {
				entry = new ClaimableBalanceClaimantCreatedEffect(this.client, data as ClaimableBalanceClaimantCreated);

				break;
			}
			case EffectTypeNames.claimableBalanceClaimed: {
				entry = new ClaimableBalanceClaimedEffect(this.client, data as ClaimableBalanceClaimed);

				break;
			}
			case EffectTypeNames.claimableBalanceCreated: {
				entry = new ClaimableBalanceCreatedEffect(this.client, data as ClaimableBalanceCreated);

				break;
			}
			case EffectTypeNames.claimableBalanceSponsorshipCreated: {
				entry = new ClaimableBalanceSponsorshipCreatedEffect(this.client, data as ClaimableBalanceSponsorshipCreated);

				break;
			}
			case EffectTypeNames.claimableBalanceSponsorshipRemoved: {
				entry = new ClaimableBalanceSponsorshipRemovedEffect(this.client, data as ClaimableBalanceSponsorshipRemoved);

				break;
			}
			case EffectTypeNames.claimableBalanceSponsorshipUpdated: {
				entry = new ClaimableBalanceSponsorshipUpdatedEffect(this.client, data as ClaimableBalanceSponsorshipUpdated);

				break;
			}
			case EffectTypeNames.dataCreated: {
				entry = new DataCreatedEffect(this.client, data as DataCreated);

				break;
			}
			case EffectTypeNames.dataRemoved: {
				entry = new DataRemovedEffect(this.client, data as DataRemoved);

				break;
			}
			case EffectTypeNames.dataSponsorshipCreated: {
				entry = new DataSponsorshipCreatedEffect(this.client, data as DateSponsorshipCreated);

				break;
			}
			case EffectTypeNames.dataSponsorshipRemoved: {
				entry = new DataSponsorshipRemovedEffect(this.client, data as DateSponsorshipRemoved);

				break;
			}
			case EffectTypeNames.dataSponsorshipUpdated: {
				entry = new DataSponsorshipUpdatedEffect(this.client, data as DateSponsorshipUpdated);

				break;
			}
			case EffectTypeNames.dataUpdated: {
				entry = new DataUpdatedEffect(this.client, data as DataUpdated);

				break;
			}
			case EffectTypeNames.sequenceBumped: {
				entry = new SequenceBumpedEffect(this.client, data as SequenceBumped);

				break;
			}
			case EffectTypeNames.signerCreated: {
				entry = new SignerCreatedEffect(this.client, data as SignerCreated);

				break;
			}
			case EffectTypeNames.signerRemoved: {
				entry = new SignerRemovedEffect(this.client, data as SignerRemoved);

				break;
			}
			case EffectTypeNames.signerSponsorshipCreated: {
				entry = new SignerSponsorshipCreatedEffect(this.client, data as SignerSponsorshipCreated);

				break;
			}
			case EffectTypeNames.signerSponsorshipRemoved: {
				entry = new SignerSponsorshipRemovedEffect(this.client, data as SignerSponsorshipRemoved);

				break;
			}
			case EffectTypeNames.signerSponsorshipUpdated: {
				entry = new SignerSponsorshipUpdatedEffect(this.client, data as SignerSponsorshipUpdated);

				break;
			}
			case EffectTypeNames.signerUpdated: {
				entry = new SignerUpdatedEffect(this.client, data as SignerUpdated);

				break;
			}
			case EffectTypeNames.trade: {
				entry = new TradeEffect(this.client, data as Trade);

				break;
			}
			case EffectTypeNames.trustlineAuthorized: {
				entry = new TrustlineAuthorizedEffect(this.client, data as TrustlineAuthorized);

				break;
			}
			case EffectTypeNames.trustlineAuthorizedToMaintainLiabilities: {
				entry = new TrustlineAuthorizedToMaintainLiabilitiesEffect(
					this.client,
					data as TrustlineAuthorizedToMaintainLiabilities,
				);

				break;
			}
			case EffectTypeNames.trustlineCreated: {
				entry = new TrustlineCreatedEffect(this.client, data as TrustlineCreated);

				break;
			}
			case EffectTypeNames.trustlineDeauthorized: {
				entry = new TrustlineDeauthorizedEffect(this.client, data as TrustlineDeauthorized);

				break;
			}
			case EffectTypeNames.trustlineFlagsUpdated: {
				entry = new TrustlineFlagsUpdatedEffect(this.client, data as unknown as TrustlineFlagsUpdated);

				break;
			}
			case EffectTypeNames.trustlineRemoved: {
				entry = new TrustlineRemovedEffect(this.client, data as TrustlineRemoved);

				break;
			}
			case EffectTypeNames.trustlineSponsorshipCreated: {
				entry = new TrustlineSponsorshipCreatedEffect(this.client, data as TrustlineSponsorshipCreated);

				break;
			}
			case EffectTypeNames.trustlineSponsorshipRemoved: {
				entry = new TrustlineSponsorshipRemovedEffect(this.client, data as TrustlineSponsorshipRemoved);

				break;
			}
			case EffectTypeNames.trustlineSponsorshipUpdated: {
				entry = new TrustlineSponsorshipUpdatedEffect(this.client, data as TrustlineSponsorshipUpdated);

				break;
			}
			case EffectTypeNames.trustlineUpdated: {
				entry = new TrustlineUpdatedEffect(this.client, data as TrustlineUpdated);

				break;
			}
			default: {
				entry = new this.hold(this.client, data);
			}
		}

		if (cache) {
			this.cache.set(entry.id, entry);
		}

		return entry as E;
	}

	/**
	 * Fetch the effect by its id in the cache or from the Pi Network Stellar API.
	 *
	 * @param id - The effect id to fetch.
	 * @param cache - If the effect should be cached (or cached effect patched), `true` by default.
	 * @param checkCache - If the effect should be fetched in the cache, `true` by default.
	 * @returns The fetched effect.
	 */
	public async fetch(id: string, cache?: boolean, checkCache = true): Promise<E> {
		const existing = checkCache && this.cache.get(id);

		if (existing) {
			return existing as E;
		}

		const [operationId, effectNumber] = id.split('-').map((part) => `${Number(part)}`);
		const operationEffects = await this.stellar.server.effects().forOperation(operationId).call();
		const effect = operationEffects.records[Number(effectNumber)];

		return this.add(effect, cache);
	}
}
