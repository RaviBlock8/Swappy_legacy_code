import getPair from "./getPair";
import { Contract } from "ethers";
import { bigIntStringToString, stringToBigIntString } from "./stringUtils";
import { loadContractInstance } from "./getWeb3";
import IERC20 from "../abis/IERC20.json";
import JSBI from "jsbi";
import getLiquidityTokens from "./getLiquidityTokens";

interface outputData {
	amountOfTokenA: string;
	amountOfTokenB: string;
}

const getTokensForLiquidityTokens = async (
	tokenInAddress: string,
	tokenOutAddress: string,
	inputTokenAmount: string,
	account: string,
	factory: Contract,
	router: Contract
): Promise<any> => {
	let pairContract = await getPair(
		factory,
		account,
		tokenInAddress,
		tokenOutAddress
	);
	if (pairContract != null) {
		let abi = JSON.stringify(IERC20.abi);
		let address = pairContract.address;
		let lqdTokens = await getLiquidityTokens(
			tokenInAddress,
			tokenOutAddress,
			account,
			factory
		);
		if (lqdTokens?.toString() === ".0") {
			return null;
		}
		let pairTokenContract = await loadContractInstance(abi, address);
		if (pairTokenContract != undefined) {
			let totalSupply = await pairTokenContract.totalSupply();
			let reserves = await router.getReserves(tokenInAddress, tokenOutAddress);
			const inputReserve = JSBI.BigInt(reserves[0]);
			const outputReserve = JSBI.BigInt(reserves[1]);
			const inputVal = JSBI.BigInt(stringToBigIntString(inputTokenAmount, 18));
			const totalS = JSBI.BigInt(totalSupply.toString());
			const amountOfTokenA = JSBI.divide(
				JSBI.multiply(inputReserve, inputVal),
				totalS
			);
			const amountOfTokenB = JSBI.divide(
				JSBI.multiply(outputReserve, inputVal),
				totalS
			);
			return {
				amountOfTokenA: bigIntStringToString(amountOfTokenA.toString(), 18),
				amountOfTokenB: bigIntStringToString(amountOfTokenB.toString(), 18),
			};
		} else {
			console.log("pairTokenContract can't be loaded");
			return null;
		}
	} else {
		console.log("pair contract doesnt exist for these tokens");
		return null;
	}
};
export default getTokensForLiquidityTokens;
