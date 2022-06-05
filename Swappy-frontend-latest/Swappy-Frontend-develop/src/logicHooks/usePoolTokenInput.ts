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
import { useSnackbar } from "notistack";
import { getQuote } from "../utils/poolUtils";

export default function usePoolTokenInput(router: Contract) {
	const [amountOftokenInType, setAmountOftokenInType] = useState("");
	const [amountOftokenOutType, setAmountOftokenOutType] = useState("");
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const changePoolTokenAmount = async (
		_amount: string,
		tokenType: string,
		tokenInType: string,
		tokenOutType: string,
		areTokenSame: Boolean
	) => {
		if (tokenInType === " ") {
			enqueueSnackbar("Swappy: Please select Token A type", {
				variant: "error",
				autoHideDuration: 3000,
			});
			return;
		}
		if (tokenOutType === " ") {
			enqueueSnackbar("Swappy: Please select Token B type", {
				variant: "error",
				autoHideDuration: 3000,
			});
			return;
		}
		if (areTokenSame) {
			enqueueSnackbar(
				"Swappy: Please make sure types of token selected are different from each other",
				{ variant: "error", autoHideDuration: 3000 }
			);
			return;
		}
		switch (tokenType) {
			case "in":
				// const changeAmountOftokenInType: any = async (event: any) => {
				console.log("value:", _amount);
				let amount = _amount;

				let num = /^-?\d*\.?\d*$/;
				//if user is typing any characters do not allow him to type
				if (amount.match(num)) {
					console.log("contain numbers");
				} else {
					return;
				}
				if (amount === "") {
					console.log("1st case");
					setAmountOftokenInType("");
					setAmountOftokenOutType("");
				} else {
					setAmountOftokenInType(amount);
					loadContractInstance(JSON.stringify(ERC20JSON.abi), tokenInType).then(
						(token: Contract | undefined) => {
							if (token !== undefined) {
								console.log("token", token);
								let tokenInTypeAmount = new TokenAmount(
									stringToBigIntString(amount, 18),
									18,
									getTokenName(tokenInType),
									token
								);
								console.log(tokenInTypeAmount);
								getQuote(
									router,
									tokenInType,
									tokenOutType,
									tokenInTypeAmount
								).then((val: any) => {
									if (val !== undefined) {
										let _val = bigIntStringToString(val, 18);
										console.log("value:", _val);
										setAmountOftokenOutType(_val);
									} else {
										setAmountOftokenOutType(amount);
									}
								});
							} else {
								console.log("erc20 token not found");
							}
						}
					);
				}
				// };

				break;
			case "out":
				const changeAmountOftokenOutType: any = (event: any) => {
					console.log("value:", event.target.value);
					let amount = event.target.value;

					let num = /^-?\d*\.?\d*$/;
					//if user is typing any characters do not allow him to type
					if (amount.match(num)) {
						console.log("contain numbers");
					} else {
						return;
					}
					if (amount === "") {
						console.log("1st case");
						setAmountOftokenInType("");
						setAmountOftokenOutType("");
					} else {
						setAmountOftokenOutType(event.target.value);
					}
				};
				break;
		}
	};
	return { amountOftokenInType, amountOftokenOutType, changePoolTokenAmount };
}
