import { Horizon, ServerApi } from 'stellar-sdk';

export function isApplicationOperation(operation: ServerApi.OperationRecord, applicationPublicKey: string): boolean {
	const isSourceAccount = operation.source_account === applicationPublicKey;

	if (isSourceAccount) {
		return true;
	}

	switch (operation.type) {
		case Horizon.OperationResponseType.createAccount: {
			return operation.funder === applicationPublicKey || operation.account === applicationPublicKey;
		}
		case Horizon.OperationResponseType.pathPayment:
		case Horizon.OperationResponseType.pathPaymentStrictSend:
		case Horizon.OperationResponseType.payment: {
			return operation.from === applicationPublicKey || operation.to === applicationPublicKey;
		}
		case Horizon.OperationResponseType.setOptions: {
			return operation.signer_key === applicationPublicKey;
		}
		case Horizon.OperationResponseType.changeTrust:
		case Horizon.OperationResponseType.allowTrust: {
			return operation.trustee === applicationPublicKey || operation.trustor === applicationPublicKey;
		}
		case Horizon.OperationResponseType.accountMerge: {
			return operation.into === applicationPublicKey;
		}
		case Horizon.OperationResponseType.createClaimableBalance: {
			return operation.claimants.some((claimant) => claimant.destination === applicationPublicKey);
		}
		case Horizon.OperationResponseType.claimClaimableBalance: {
			return operation.claimant === applicationPublicKey;
		}
		case Horizon.OperationResponseType.beginSponsoringFutureReserves: {
			return operation.sponsored_id === applicationPublicKey;
		}
		case Horizon.OperationResponseType.endSponsoringFutureReserves: {
			return operation.begin_sponsor === applicationPublicKey;
		}
		case Horizon.OperationResponseType.revokeSponsorship: {
			return (
				operation.account_id === applicationPublicKey ||
				operation.trustline_account_id === applicationPublicKey ||
				operation.signer_account_id === applicationPublicKey
			);
		}
	}

	return false;
}
