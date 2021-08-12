import { ServerApi } from 'stellar-sdk';

export function isApplicationOffer(offer: ServerApi.OfferRecord, applicationPublicKey: string): boolean {
	return (
		offer.seller === applicationPublicKey ||
		offer.sponsor === applicationPublicKey ||
		offer.selling.asset_issuer === applicationPublicKey
	);
}
