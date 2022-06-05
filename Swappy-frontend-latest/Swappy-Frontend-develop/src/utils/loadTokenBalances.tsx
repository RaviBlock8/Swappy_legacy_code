import ERC20 from "../abis/IERC20.json";
import { loadContractInstance } from "./getWeb3";
import { data } from "../addresses/tokens";
import { TokenDataInterface } from "../addresses/tokens";
import { bigIntStringToString } from "./stringUtils";
import { Contract } from "ethers";

export interface PriceList {
	name: string;
	address: string;
	balance: string;
}

const _loadBalance = async (
	token: TokenDataInterface,
	account: string,
	abi: string
) => {
	let contract = await loadContractInstance(abi, token.address);
	if (contract !== undefined) {
		let price_bg = await contract.balanceOf(account);
		let balance = bigIntStringToString(price_bg.toString(), 18);
		return Promise.resolve({
			name: token.name,
			address: token.address,
			balance: balance,
		});
	}
};

const loadTokenBalances = async (account: string): Promise<PriceList[]> => {
	let abi = JSON.stringify(ERC20.abi);
	let priceList: PriceList[] = [];
	try {
		let res = await Promise.allSettled(
			data.map((token: TokenDataInterface) => {
				return _loadBalance(token, account, abi);
				// loadContractInstance(abi, token.address).then(async (contract) => {
				// 	if (contract !== undefined) {
				// 		let price_bg = await contract.balanceOf(account);
				// 		let balance = bigIntStringToString(price_bg.toString(), 18);
				// 		priceList.push({
				// 			name: token.name,
				// 			address: token.address,
				// 			balance: balance,
				// 		});
				// 	}
				// });
			})
		);
		console.log("data we got while loading balance:", res);
		const filterdList: PriceList[] = [];
		res.map((res) => {
			if (res.status === "fulfilled") {
				if (res.value !== undefined) {
					filterdList.push(res.value);
				}
			}
		});
		filterdList.sort((a, b) => {
			if (a.name >= b.name) {
				return 1;
			} else {
				return -1;
			}
		});
		console.log("filtered list:", filterdList);
		return filterdList;
	} catch (err) {
		throw new Error("Problem loading token balances");
	}
};

export default loadTokenBalances;
