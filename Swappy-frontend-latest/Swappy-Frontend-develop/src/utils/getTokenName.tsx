import { data, TokenDataInterface } from "../addresses/tokens";

const getTokenName: (tokenAddress: string) => string = function (tokenAddress) {
	let token = data.find((token: TokenDataInterface) => {
		if (token.address === tokenAddress) {
			return token.name;
		}
	});
	if (token === undefined) {
		return " ";
	} else {
		return token.name;
	}
};

export default getTokenName;
