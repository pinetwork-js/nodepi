import { AccountCreatedEffect } from './AccountCreatedEffect';
import { AccountCreditedEffect } from './AccountCreditedEffect';
import { AccountDebitedEffect } from './AccountDebitedEffect';
import { AccountFlagsUpdatedEffect } from './AccountFlagsUpdatedEffect';
import { AccountHomeDomainUpdatedEffect } from './AccountHomeDomainUpdatedEffect';
import { AccountSponsorshipCreatedEffect } from './AccountSponsorshipCreatedEffect';
import { AccountSponsorshipRemovedEffect } from './AccountSponsorshipRemovedEffect';
import { AccountSponsorshipUpdatedEffect } from './AccountSponsorshipUpdatedEffect';
import { AccountThresholdsUpdatedEffect } from './AccountThresholdsUpdatedEffect';
import { ClaimableBalanceClaimantCreatedEffect } from './ClaimableBalanceClaimantCreatedEffect';
import { ClaimableBalanceClaimedEffect } from './ClaimableBalanceClaimedEffect';
import { ClaimableBalanceCreatedEffect } from './ClaimableBalanceCreatedEffect';
import { ClaimableBalanceSponsorshipCreatedEffect } from './ClaimableBalanceSponsorshipCreatedEffect';
import { ClaimableBalanceSponsorshipRemovedEffect } from './ClaimableBalanceSponsorshipRemovedEffect';
import { ClaimableBalanceSponsorshipUpdatedEffect } from './ClaimableBalanceSponsorshipUpdatedEffect';
import { DataCreatedEffect } from './DataCreatedEffect';
import { DataRemovedEffect } from './DataRemovedEffect';
import { DataSponsorshipCreatedEffect } from './DataSponsorshipCreatedEffect';
import { DataSponsorshipRemovedEffect } from './DataSponsorshipRemovedEffect';
import { DataSponsorshipUpdatedEffect } from './DataSponsorshipUpdatedEffect';
import { DataUpdatedEffect } from './DataUpdatedEffect';
import { Effect } from './Effect';
import { SequenceBumpedEffect } from './SequenceBumpedEffect';
import { SignerCreatedEffect } from './SignerCreatedEffect';
import { SignerRemovedEffect } from './SignerRemovedEffect';
import { SignerSponsorshipCreatedEffect } from './SignerSponsorshipCreatedEffect';
import { SignerSponsorshipRemovedEffect } from './SignerSponsorshipRemovedEffect';
import { SignerSponsorshipUpdatedEffect } from './SignerSponsorshipUpdatedEffect';
import { SignerUpdatedEffect } from './SignerUpdatedEffect';
import { TradeEffect } from './TradeEffect';
import { TrustlineAuthorizedEffect } from './TrustlineAuthorizedEffect';
import { TrustlineAuthorizedToMaintainLiabilitiesEffect } from './TrustlineAuthorizedToMaintainLiabilitiesEffect';
import { TrustlineCreatedEffect } from './TrustlineCreatedEffect';
import { TrustlineDeauthorizedEffect } from './TrustlineDeauthorizedEffect';
import { TrustlineFlagsUpdatedEffect } from './TrustlineFlagsUpdatedEffect';
import { TrustlineRemovedEffect } from './TrustlineRemovedEffect';
import { TrustlineSponsorshipCreatedEffect } from './TrustlineSponsorshipCreatedEffect';
import { TrustlineSponsorshipRemovedEffect } from './TrustlineSponsorshipRemovedEffect';
import { TrustlineSponsorshipUpdatedEffect } from './TrustlineSponsorshipUpdatedEffect';
import { TrustlineUpdatedEffect } from './TrustlineUpdatedEffect';

export * from './AccountCreatedEffect';
export * from './AccountCreditedEffect';
export * from './AccountDebitedEffect';
export * from './AccountFlagsUpdatedEffect';
export * from './AccountHomeDomainUpdatedEffect';
export * from './AccountSponsorshipCreatedEffect';
export * from './AccountSponsorshipRemovedEffect';
export * from './AccountSponsorshipUpdatedEffect';
export * from './AccountThresholdsUpdatedEffect';
export * from './ClaimableBalanceClaimantCreatedEffect';
export * from './ClaimableBalanceClaimedEffect';
export * from './ClaimableBalanceCreatedEffect';
export * from './ClaimableBalanceSponsorshipCreatedEffect';
export * from './ClaimableBalanceSponsorshipRemovedEffect';
export * from './ClaimableBalanceSponsorshipUpdatedEffect';
export * from './DataCreatedEffect';
export * from './DataRemovedEffect';
export * from './DataSponsorshipCreatedEffect';
export * from './DataSponsorshipRemovedEffect';
export * from './DataSponsorshipUpdatedEffect';
export * from './DataUpdatedEffect';
export * from './Effect';
export * from './SequenceBumpedEffect';
export * from './SignerCreatedEffect';
export * from './SignerRemovedEffect';
export * from './SignerSponsorshipCreatedEffect';
export * from './SignerSponsorshipRemovedEffect';
export * from './SignerSponsorshipUpdatedEffect';
export * from './SignerUpdatedEffect';
export * from './TradeEffect';
export * from './TrustlineAuthorizedEffect';
export * from './TrustlineAuthorizedToMaintainLiabilitiesEffect';
export * from './TrustlineCreatedEffect';
export * from './TrustlineDeauthorizedEffect';
export * from './TrustlineFlagsUpdatedEffect';
export * from './TrustlineRemovedEffect';
export * from './TrustlineSponsorshipCreatedEffect';
export * from './TrustlineSponsorshipRemovedEffect';
export * from './TrustlineSponsorshipUpdatedEffect';
export * from './TrustlineUpdatedEffect';

export enum EffectTypeNames {
	accountCreated = 'account_created',
	accountCredited = 'account_credited',
	accountDebited = 'account_debited',
	accountThresholdsUpdated = 'account_thresholds_updated',
	accountHomeDomainUpdated = 'account_home_domain_updated',
	accountFlagsUpdated = 'account_flags_updated',
	signerCreated = 'signer_created',
	signerRemoved = 'signer_removed',
	signerUpdated = 'signer_updated',
	trustlineCreated = 'trustline_created',
	trustlineRemoved = 'trustline_removed',
	trustlineUpdated = 'trustline_updated',
	trustlineAuthorized = 'trustline_authorized',
	trustlineDeauthorized = 'trustline_deauthorized',
	trustlineAuthorizedToMaintainLiabilities = 'trustline_authorized_to_maintain_liabilities',
	trustlineFlagsUpdated = 'trustline_flags_updated',
	trade = 'trade',
	dataCreated = 'data_created',
	dataRemoved = 'data_removed',
	dataUpdated = 'data_updated',
	sequenceBumped = 'sequence_bumped',
	claimableBalanceCreated = 'claimable_balance_created',
	claimableBalanceClaimantCreated = 'claimable_balance_claimant_created',
	claimableBalanceClaimed = 'claimable_balance_claimed',
	accountSponsorshipCreated = 'account_sponsorship_created',
	accountSponsorshipUpdated = 'account_sponsorship_updated',
	accountSponsorshipRemoved = 'account_sponsorship_removed',
	trustlineSponsorshipCreated = 'trustline_sponsorship_created',
	trustlineSponsorshipUpdated = 'trustline_sponsorship_updated',
	trustlineSponsorshipRemoved = 'trustline_sponsorship_removed',
	dataSponsorshipCreated = 'data_sponsorship_created',
	dataSponsorshipUpdated = 'data_sponsorship_updated',
	dataSponsorshipRemoved = 'data_sponsorship_removed',
	claimableBalanceSponsorshipCreated = 'claimable_balance_sponsorship_created',
	claimableBalanceSponsorshipUpdated = 'claimable_balance_sponsorship_updated',
	claimableBalanceSponsorshipRemoved = 'claimable_balance_sponsorship_removed',
	signerSponsorshipCreated = 'signer_sponsorship_created',
	signerSponsorshipUpdated = 'signer_sponsorship_updated',
	signerSponsorshipRemoved = 'signer_sponsorship_removed',
}

type Effects = Record<EffectTypeNames, Effect>;

export interface EffectStructures extends Effects {
	accountCreated: AccountCreatedEffect;
	accountCredited: AccountCreditedEffect;
	accountDebited: AccountDebitedEffect;
	accountThresholdsUpdated: AccountThresholdsUpdatedEffect;
	accountHomeDomainUpdated: AccountHomeDomainUpdatedEffect;
	accountFlagsUpdated: AccountFlagsUpdatedEffect;
	signerCreated: SignerCreatedEffect;
	signerRemoved: SignerRemovedEffect;
	signerUpdated: SignerUpdatedEffect;
	trustlineCreated: TrustlineCreatedEffect;
	trustlineRemoved: TrustlineRemovedEffect;
	trustlineUpdated: TrustlineUpdatedEffect;
	trustlineAuthorized: TrustlineAuthorizedEffect;
	trustlineDeauthorized: TrustlineDeauthorizedEffect;
	trustlineAuthorizedToMaintainLiabilities: TrustlineAuthorizedToMaintainLiabilitiesEffect;
	trustlineFlagsUpdated: TrustlineFlagsUpdatedEffect;
	trade: TradeEffect;
	dataCreated: DataCreatedEffect;
	dataRemoved: DataRemovedEffect;
	dataUpdated: DataUpdatedEffect;
	sequenceBumped: SequenceBumpedEffect;
	claimableBalanceCreated: ClaimableBalanceCreatedEffect;
	claimableBalanceClaimantCreated: ClaimableBalanceClaimantCreatedEffect;
	claimableBalanceClaimed: ClaimableBalanceClaimedEffect;
	accountSponsorshipCreated: AccountSponsorshipCreatedEffect;
	accountSponsorshipUpdated: AccountSponsorshipUpdatedEffect;
	accountSponsorshipRemoved: AccountSponsorshipRemovedEffect;
	trustlineSponsorshipCreated: TrustlineSponsorshipCreatedEffect;
	trustlineSponsorshipUpdated: TrustlineSponsorshipUpdatedEffect;
	trustlineSponsorshipRemoved: TrustlineSponsorshipRemovedEffect;
	dataSponsorshipCreated: DataSponsorshipCreatedEffect;
	dataSponsorshipUpdated: DataSponsorshipUpdatedEffect;
	dataSponsorshipRemoved: DataSponsorshipRemovedEffect;
	claimableBalanceSponsorshipCreated: ClaimableBalanceSponsorshipCreatedEffect;
	claimableBalanceSponsorshipUpdated: ClaimableBalanceSponsorshipUpdatedEffect;
	claimableBalanceSponsorshipRemoved: ClaimableBalanceSponsorshipRemovedEffect;
	signerSponsorshipCreated: SignerSponsorshipCreatedEffect;
	signerSponsorshipUpdated: SignerSponsorshipUpdatedEffect;
	signerSponsorshipRemoved: SignerSponsorshipRemovedEffect;
}
