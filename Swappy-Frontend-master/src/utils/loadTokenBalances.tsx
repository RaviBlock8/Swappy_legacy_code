import ERC20 from "../abis/IERC20.json";
import { loadContractInstance } from "./getWeb3";
import { data } from "../addresses/tokens";
import { TokenDataInterface } from "../addresses/tokens";
import { bigIntStringToString } from "./stringUtils";

export interface PriceList {
	name: string;
	address: string;
	balance: string;
}

const loadTokenBalances = async (account: string): Promise<PriceList[]> => {
	let abi = JSON.stringify(ERC20.abi);
	let priceList: PriceList[] = [];
	try {
		data.map((token: TokenDataInterface) => {
			loadContractInstance(abi, token.address).then(async (contract) => {
				if (contract !== undefined) {
					let price_bg = await contract.balanceOf(account);
					let balance = bigIntStringToString(price_bg.toString(), 18);
					priceList.push({
						name: token.name,
						address: token.address,
						balance: balance,
					});
				}
			});
		});
	} catch (err) {
		throw new Error("Problem loading token balances");
	}
	return priceList;
};

export default loadTokenBalances;
