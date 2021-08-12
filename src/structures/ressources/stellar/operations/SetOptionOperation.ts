import { Horizon, ServerApi } from 'stellar-sdk';

import { Client } from '../../../../clients';
import { Account } from '../Account';
import { Operation } from './Operation';

enum NumericFlags {
	AuthRequired = 1,
	AuthRevocable = 2,
	AutImmutable = 4,
}

type Flags = 'auth_required_flag' | 'auth_revocable_flag' | 'auth_immutable_flag';

/**
 * Structure representing a Stellar Set Option Operation.
 */
export class SetOptionOperation extends Operation<
	Horizon.OperationResponseType.setOptions,
	Horizon.OperationResponseTypeI.setOptions
> {
	/**
	 * The public key of the new signer.
	 */
	public signerId?: string;

	/**
	 * The weight of the new signer. Can range from `1` to `255`.
	 */
	public signerWeight?: number;

	/**
	 * The weight of the master key. Can range from `1` to `255`.
	 */
	public masterKeyWeight?: number;

	/**
	 * The sum weight for the low threshold.
	 */
	public lowThreshold?: number;

	/**
	 * The sum weight for the medium threshold.
	 */
	public medThreshold?: number;

	/**
	 * The sum weight for the high threshold.
	 */
	public highThreshold?: number;

	/**
	 * The home domain used for stellar.toml file discovery.
	 */
	public homeDomain?: string;

	/**
	 * The numeric values of flags that has been set in the operation. Options include `1` for `auth_required_flag`, `2` for `auth_revocable_flag` and `4 `for `auth_immutable_flag`.
	 */
	public setNumericFlags?: NumericFlags[];

	/**
	 * The values of flags that has been set in the operation. Options include `auth_required_flag`, `auth_revocable_flag` and `auth_immutable_flag`.
	 */
	public setFlags?: Flags[];

	/**
	 * The numeric values of flags that has been cleared in the operation. Options include `1` for `auth_required_flag`, `2` for `auth_revocable_flag` and `4 `for `auth_immutable_flag`.
	 */
	public clearNumericFlags?: NumericFlags[];

	/**
	 * The values of flags that has been cleared in the operation. Options include `auth_required_flag`, `auth_revocable_flag` and `auth_immutable_flag`.
	 */
	public clearFlags?: Flags[];

	public constructor(client: Client, data: ServerApi.SetOptionsOperationRecord) {
		super(client, data);

		this.$patch(data);
	}

	public $patch(data: ServerApi.SetOptionsOperationRecord): void {
		super.$patch(data);

		this.signerId = data.signer_key;
		this.signerWeight = data.signer_weight;
		this.masterKeyWeight = data.master_key_weight;
		this.lowThreshold = data.low_threshold;
		this.medThreshold = data.med_threshold;
		this.highThreshold = data.high_threshold;
		this.homeDomain = data.home_domain;
		this.setNumericFlags = data.set_flags;
		this.setFlags = data.set_flags_s as unknown as Flags[];
		this.clearNumericFlags = data.clear_flags;
		this.clearFlags = data.clear_flags_s as unknown as Flags[];
	}

	/**
	 * Get the account of the new signer.
	 *
	 * @param forceUpdate - If set to `true`, it will not check in the cache and directly make a request to retrieve the signer account instead.
	 * @returns The account of the new signer.
	 */
	public async getSignerAccount(forceUpdate = false): Promise<Account | undefined> {
		if (!this.signerId) {
			return;
		}

		return this.client.stellar.accounts.fetch(this.signerId, true, !forceUpdate);
	}
}
