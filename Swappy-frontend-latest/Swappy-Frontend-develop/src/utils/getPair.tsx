import { loadContractInstance } from "./getWeb3";
import { Contract } from "ethers";
import ISwappyPairJSON from "../abis/ISwappyPair.json";
import { useSnackbar } from "notistack";

const pairEvents = async (
	factory: Contract,
	account: string,
	tokenIn: string,
	tokenOut: string
): Promise<Contract | null> => {
	try {
		const pairAddress = await factory.functions.getPair(tokenIn, tokenOut);
		console.log(pairAddress);
		const pairContract = await loadContractInstance(
			JSON.stringify(ISwappyPairJSON.abi),
			pairAddress
		);
		console.log("pair contract", pairContract);
		if (pairContract != undefined) {
			return pairContract;
		} else {
			return null;
		}
	} catch (err) {
		console.log("error in getpair:", err);
		return null;
	}
};
export default pairEvents;
