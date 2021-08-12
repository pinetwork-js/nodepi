import { ServerApi } from 'stellar-sdk';

import { StellarClient } from '../clients';
import { isApplicationOperation } from './isApplicationOperation';

export async function isApplicationTrade(
	this: StellarClient,
	trade: ServerApi.TradeRecord,
	applicationPublicKey: string,
): Promise<boolean> {
	const operationId = trade.id.split('-')[0];
	const tradeOperation = await this.server.operations().operation(operationId).call();

	return isApplicationOperation(tradeOperation, applicationPublicKey);
}
