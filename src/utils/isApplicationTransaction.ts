import { ServerApi } from 'stellar-sdk';
import { isApplicationOperation } from './isApplicationOperation';

export async function isApplicationTransaction(
	transaction: ServerApi.TransactionRecord,
	applicationPublicKey: string,
): Promise<boolean> {
	const transactionOperations = (await transaction.operations()).records;

	return transactionOperations.some((operation) => isApplicationOperation(operation, applicationPublicKey));
}
