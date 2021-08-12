import { ServerApi } from 'stellar-sdk';
import { isApplicationOperation } from './isApplicationOperation';

export async function isApplicationLedger(
	ledger: ServerApi.LedgerRecord,
	applicationPublicKey: string,
): Promise<boolean> {
	const ledgerOperations = (await ledger.operations()).records;

	return ledgerOperations.some((operation) => isApplicationOperation(operation, applicationPublicKey));
}
