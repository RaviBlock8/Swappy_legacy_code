export interface IAddresses {
	router: string | undefined;
	factory: string | undefined;
}

export interface IHash {
	[details: string] : IAddresses;
}
export const Contracts: IHash = {
	"1": {
		router: "",
		factory: "",
	},
	"4": {
		factory: "0x04308c6d9dc9a8694082e08765449991e05cc9f2",
		router: "0x1adf2bcd69ac03a6f7a6c20d9c2b73bfd4871d32"
	},
	"5777": {
		factory: process.env.REACT_APP_FACTORY,
		router: process.env.REACT_APP_ROUTER
	}
}
