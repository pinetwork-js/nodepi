export interface Identifiable<K = string> {
	id: K;
}

export interface Patchable {
	$patch(data: unknown): void;
}
