/* eslint-disable @typescript-eslint/ban-types */

export type DeepRequired<T extends {}> = {
	[K in keyof T]-?: T extends {} ? DeepRequired<T[K]> : T[K];
};

export type DeepPartial<T extends {}> = {
	[K in keyof T]?: T extends {} ? DeepPartial<T[K]> : T[K];
};
