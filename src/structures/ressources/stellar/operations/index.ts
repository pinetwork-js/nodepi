import { Horizon } from 'stellar-sdk';

import { AccountMergeOperation } from './AccountMergeOperation';
import { AllowTrustOperation } from './AllowTrustOperation';
import { BeginSponsoringFutureReservesOperation } from './BeginSponsoringFutureReservesOperation';
import { BumpSequenceOperation } from './BumpSequenceOperation';
import { ChangeTrustOperation } from './ChangeTrustOperation';
import { ClaimClaimableBalanceOperation } from './ClaimClaimableBalanceOperation';
import { CreateAccountOperation } from './CreateAccountOperation';
import { CreateClaimableBalanceOperation } from './CreateClaimableBalanceOperation';
import { CreatePassiveSellOfferOperation } from './CreatePassiveSellOfferOperation';
import { EndSponsoringFutureReservesOperation } from './EndSponsoringFutureReservesOperation';
import { ManageBuyOfferOperation } from './ManageBuyOfferOperation';
import { ManageDataOperation } from './ManageDataOperation';
import { ManageSellOfferOperation } from './ManageSellOfferOperation';
import { Operation } from './Operation';
import { PathPaymentReceiveOperation } from './PathPaymentReceiveOperation';
import { PathPaymentSendOperation } from './PathPaymentSendOperation';
import { PaymentOperation } from './PaymentOperation';
import { RevokeSponsorshipOperation } from './RevokeSponsorshipOperation';
import { SetOptionOperation } from './SetOptionOperation';

export * from './AccountMergeOperation';
export * from './AllowTrustOperation';
export * from './BeginSponsoringFutureReservesOperation';
export * from './BumpSequenceOperation';
export * from './ChangeTrustOperation';
export * from './ClaimClaimableBalanceOperation';
export * from './CreateAccountOperation';
export * from './CreateClaimableBalanceOperation';
export * from './CreatePassiveSellOfferOperation';
export * from './EndSponsoringFutureReservesOperation';
export * from './ManageBuyOfferOperation';
export * from './ManageDataOperation';
export * from './ManageSellOfferOperation';
export * from './Operation';
export * from './PathPaymentReceiveOperation';
export * from './PathPaymentSendOperation';
export * from './PaymentOperation';
export * from './RevokeSponsorshipOperation';
export * from './SetOptionOperation';

type Operations = Record<Horizon.OperationResponseType, Operation>;

export interface OperationStructures extends Operations {
	create_account: CreateAccountOperation;
	payment: PaymentOperation;
	path_payment_strict_receive: PathPaymentReceiveOperation;
	create_passive_sell_offer: CreatePassiveSellOfferOperation;
	manage_sell_offer: ManageSellOfferOperation;
	set_options: SetOptionOperation;
	change_trust: ChangeTrustOperation;
	allow_trust: AllowTrustOperation;
	account_merge: AccountMergeOperation;
	manage_data: ManageDataOperation;
	bump_sequence: BumpSequenceOperation;
	manage_buy_offer: ManageBuyOfferOperation;
	path_payment_strict_send: PathPaymentSendOperation;
	create_claimable_balance: CreateClaimableBalanceOperation;
	claim_claimable_balance: ClaimClaimableBalanceOperation;
	begin_sponsoring_future_reserves: BeginSponsoringFutureReservesOperation;
	end_sponsoring_future_reserves: EndSponsoringFutureReservesOperation;
	revoke_sponsorship: RevokeSponsorshipOperation;
}
