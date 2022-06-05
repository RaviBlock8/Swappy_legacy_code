import { getAmountOut } from "./swapUtils";
import { Contract } from "ethers";
import { data, TokenDataInterface } from "../addresses/tokens";
import { loadContractInstance } from "./getWeb3";
import IERC20 from "../abis/IERC20.json";
import getTokenAddress from "./getTokenAddress";
import TokenAmount from "./entities/TokenAmount";
import { bigIntStringToString, stringToBigIntString } from "./stringUtils";
import { OutlinedInput } from "@material-ui/core";
const abi = JSON.stringify(IERC20.abi);

export interface Output {
	name: string;
	conversionRate: string | null;
}

const getConvertRate = async (
	inputVal: TokenAmount,
	tokenInAddress: string,
	token: TokenDataInterface,
	router: Contract
) => {
	let outAmount = await getAmountOut(
		router,
		token.address,
		tokenInAddress,
		inputVal
	);
	let res = {
		name: token.name,
		conversionRate:
			outAmount === undefined
				? null
				: bigIntStringToString(outAmount?.toString(), 18),
	};
	return res;
};

const getConvertFromRateList = async (
	tokenInName: string,
	router: Contract
): Promise<Output[] | null> => {
	try {
		let tokenInAddress = getTokenAddress(tokenInName);
		const tokenContract = await loadContractInstance(abi, tokenInAddress);
		if (tokenContract != undefined) {
			let inputVal = new TokenAmount(
				stringToBigIntString("1", 18),
				18,
				tokenInName,
				tokenContract
			);

			const response = await Promise.allSettled(
				data.map((token) => {
					return getConvertRate(inputVal, tokenInAddress, token, router);
				})
			);
			const filterdList: Output[] = [];
			response.map((res) => {
				if (res.status === "fulfilled") {
					filterdList.push({
						name: res.value.name,
						conversionRate: res.value.conversionRate,
					});
				}
			});
			return filterdList;
		} else {
			throw new Error("Swappi: Couldn't load tokenIn contract");
		}
	} catch (err) {
		console.log(err);
		return null;
	}
};

export default getConvertFromRateList;
