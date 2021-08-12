import { ServerApi } from 'stellar-sdk';
import { EffectType } from 'stellar-sdk/lib/types/effects';
import { Trade } from 'stellar-sdk/lib/types/trade';
import { TrustlineFlagsUpdated } from '../structures';

function isTrade(effect: ServerApi.EffectRecord): effect is Trade {
	return 'seller' in effect;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isTrustlineFlagsUpdated(effect: any): effect is TrustlineFlagsUpdated {
	return effect.type_i === EffectType.trustline_flags_updated;
}

export function isApplicationEffect(effect: ServerApi.EffectRecord, applicationPublicKey: string): boolean {
	const isSourceAccount = effect.account === applicationPublicKey;

	if (isSourceAccount) {
		return true;
	}

	if (isTrade(effect)) {
		return effect.seller === applicationPublicKey;
	} else if (isTrustlineFlagsUpdated(effect)) {
		return (effect as TrustlineFlagsUpdated).trustor === applicationPublicKey;
	}

	switch (effect.type_i) {
		case EffectType.account_sponsorship_created:
		case EffectType.claimable_balance_sponsorship_created:
		case EffectType.data_sponsorship_created:
		case EffectType.trustline_sponsorship_created: {
			return effect.sponsor === applicationPublicKey;
		}
		case EffectType.account_sponsorship_updated:
		case EffectType.claimable_balance_sponsorship_updated:
		case EffectType.data_sponsorship_updated:
		case EffectType.trustline_sponsorship_updated: {
			return effect.former_sponsor === applicationPublicKey || effect.new_sponsor === applicationPublicKey;
		}
		case EffectType.account_sponsorship_removed:
		case EffectType.claimable_balance_sponsorship_removed:
		case EffectType.data_sponsorship_removed:
		case EffectType.trustline_sponsorship_removed: {
			return effect.former_sponsor === applicationPublicKey;
		}
		case EffectType.signer_sponsorship_created: {
			return effect.sponsor === applicationPublicKey || effect.signer === applicationPublicKey;
		}
		case EffectType.signer_sponsorship_updated: {
			return (
				effect.former_sponsor === applicationPublicKey ||
				effect.new_sponsor === applicationPublicKey ||
				effect.signer === applicationPublicKey
			);
		}
		case EffectType.signer_sponsorship_removed: {
			return effect.former_sponsor === applicationPublicKey || effect.signer === applicationPublicKey;
		}
		case EffectType.signer_created:
		case EffectType.signer_updated:
		case EffectType.signer_removed: {
			return effect.public_key === applicationPublicKey;
		}
		case EffectType.trustline_authorized:
		case EffectType.trustline_authorized_to_maintain_liabilities:
		case EffectType.trustline_deauthorized: {
			return effect.trustor === applicationPublicKey;
		}
	}

	return false;
}
