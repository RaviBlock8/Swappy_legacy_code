import React from "react";
import getPair from "./getPair";
import { Contract } from "ethers";
import { bigIntStringToString } from "./stringUtils";
import { loadContractInstance } from "./getWeb3";
import IERC20 from "../abis/IERC20.json";

const getLiquidityTokens = async (
	tokenInAddress: string,
	tokenOutAddress: string,
	account: string,
	factory: Contract
): Promise<string | null> => {
	let pairContract = await getPair(
		factory,
		account,
		tokenInAddress,
		tokenOutAddress
	);
	if (pairContract === null) {
		console.log("pair doesn't exist");
		return null;
	} else {
		let lqd = await loadContractInstance(
			JSON.stringify(IERC20.abi),
			pairContract.address
		);
		console.log("lqd contract:", lqd);
		if (lqd !== undefined) {
			let amount = await lqd.balanceOf(account);
			console.log("lqd amount:", bigIntStringToString(amount.toString(), 18));
			return bigIntStringToString(amount.toString(), 18);
		} else {
			return null;
		}
	}
};

export default getLiquidityTokens;
