import { useState } from "react";
import ERC20JSON from "../abis/IERC20.json";
import { loadContractInstance } from "../utils/getWeb3";
import TokenAmount from "../utils/entities/TokenAmount";
import {
	stringToBigIntString,
	bigIntStringToString,
} from "../utils/stringUtils";
import getTokenName from "../utils/getTokenName";
import { Contract } from "ethers";
import { getAmountIn, getAmountOut } from "../utils/swapUtils";
import { useSnackbar } from "notistack";

export default function useTokenInput(router: Contract) {
	const [tokenInAmount, setTokenInAmount] = useState("");
	const [tokenOutAmount, setTokenOutAmount] = useState("");
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const changeTokenAmount = async (
		_amount: string,
		tokenType: string,
		tokenInType: string,
		tokenOutType: string,
		areTokenSame: Boolean
	) => {
		if (tokenInType === " ") {
			enqueueSnackbar("Please select from token type", { variant: "error", autoHideDuration:3000});
			return;
		}
		if (tokenOutType === " ") {
			enqueueSnackbar("Please select to token type", { variant: "error", autoHideDuration:3000 });
			return;
		}
		if (areTokenSame) {
			enqueueSnackbar(
				"Please make sure types of token selected are different from each other",
				{ variant: "error", autoHideDuration:3000 }
			);
			return;
		}
		let num = /^-?\d*\.?\d*$/;
		//if user is typing any characters do not allow him to type
		if (_amount.match(num)) {
			console.log("contain numbers");
		} else {
			return;
		}
		//if input field contains empty string set both input fields to empty strings
		if (_amount === "") {
			console.log("1st case");
			setTokenInAmount("");
			setTokenOutAmount("");
		} else {
			switch (tokenType) {
				case "in":
					setTokenInAmount(_amount);
					loadContractInstance(JSON.stringify(ERC20JSON.abi), tokenInType).then(
						(token: Contract | undefined) => {
							if (token !== undefined) {
								let temp = new TokenAmount(
									stringToBigIntString(_amount, 18),
									18,
									getTokenName(tokenInType),
									token
								);
								let val = getAmountOut(router, tokenInType, tokenOutType, temp);
								val.then((val) => {
									if (val !== undefined) {
										setTokenOutAmount(bigIntStringToString(val, 18));
									} else {
										console.log("value is undefined");
									}
								});
							}
						}
					);

					break;
				case "out":
					setTokenOutAmount(_amount);
					loadContractInstance(
						JSON.stringify(ERC20JSON.abi),
						tokenOutType
					).then((token: Contract | undefined) => {
						if (token !== undefined) {
							let temp = new TokenAmount(
								stringToBigIntString(_amount, 18),
								18,
								getTokenName(tokenOutType),
								token
							);
							let val = getAmountIn(router, tokenInType, tokenOutType, temp);
							val.then((val) => {
								if (val !== undefined) {
									setTokenInAmount(bigIntStringToString(val, 18));
								} else {
									console.log("value is undefined");
								}
							});
						}
					});
					break;
			}
		}
	};
	return { tokenInAmount, tokenOutAmount, changeTokenAmount };
}
