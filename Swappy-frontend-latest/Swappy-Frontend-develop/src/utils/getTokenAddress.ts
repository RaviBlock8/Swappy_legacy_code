import { data, TokenDataInterface } from "../addresses/tokens";

const getTokenAddress = (tokenName: string): string => {
	for (const token of data) {
		if (token.name.toLowerCase() === tokenName.toLowerCase()) {
			return token.address;
		}
	}
	return " ";
};

export default getTokenAddress;
