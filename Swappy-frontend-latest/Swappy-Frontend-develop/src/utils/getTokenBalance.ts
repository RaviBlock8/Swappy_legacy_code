import { loadContractInstance } from "./getWeb3";
import { bigIntStringToString } from "./stringUtils";
import IERC20 from "../abis/IERC20.json";
import { Contract } from "ethers";

const getTokenBalance: (
	account: string,
	tokenAddress: string
) => Promise<string | null> = async (account, tokenAddress) => {
	const abi = JSON.stringify(IERC20.abi);
	try {
		const contract = await loadContractInstance(abi, tokenAddress);
		if (contract !== undefined) {
			let price_bg = await contract.balanceOf(account);
			let balance = bigIntStringToString(price_bg.toString(), 18);
			return balance;
		} else {
			throw new Error("Contract doesn't exist for this contract");
		}
	} catch (err) {
		console.log(err);
		return null;
	}
};

export default getTokenBalance;
