import { ServerApi } from 'stellar-sdk';

export function isApplicationAccount(account: ServerApi.AccountRecord, applicationPublicKey: string): boolean {
	return (
		account.account_id === applicationPublicKey ||
		account.sponsor === applicationPublicKey ||
		account.signers.some((signer) => signer.key === applicationPublicKey)
	);
}
