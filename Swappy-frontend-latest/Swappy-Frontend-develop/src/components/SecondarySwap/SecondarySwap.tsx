import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import TokenConvertFrom from "../TokenConvertFrom/TokenConvertFrom";
import TokenBuyInput from "../TokenBuyInput/TokenBuyInput";
import TokenBuyCheckout from "../TokenBuyCheckout/TokenBuyCheckout";
import { connect } from "react-redux";
import { StateInterface, ConversionList } from "../../store/reducer";
import { Dispatch } from "redux";
import getTokenAddress from "../../utils/getTokenAddress";
import getTokenName from "../../utils/getTokenName";
import getTokenBalance from "../../utils/getTokenBalance";
import { loadContractInstance } from "../../utils/getWeb3";
import IERC20 from "../../abis/IERC20.json";
import { getAmountOut, swapExactTokensForTokens } from "../../utils/swapUtils";
import {
	bigIntStringToString,
	stringToBigIntString,
} from "../../utils/stringUtils";
import { Contract } from "ethers";
import TokenAmount from "../../utils/entities/TokenAmount";
import { useSnackbar } from "notistack";
import { PriceList } from "../../utils/loadTokenBalances";
import { approveTokenAmount } from "../../utils/approveUtils";
import loadTokenBalances from "../../utils/loadTokenBalances";
import useTokenInput from "../../logicHooks/useTokenInput";

interface IProps {
	open: boolean;
}
function SecondarySwap({
	conversionList,
	setConversionList,
	tokenName,
	account,
	router,
	slippage,
	timeLimit,
	setBalances,
}: any) {
	useEffect(() => {
		console.log("token out type:", tokenName);
		setTokenOutType(getTokenAddress(tokenName));
	});
	const [tokenConvertFromOpen, setTCFClose] = useState<boolean>(true);
	const [TBIOpen, setTBI] = useState<boolean>(false);
	const [TBCOpen, setTBC] = useState<boolean>(false);
	const [tokenInType, setTokenInType] = useState<string | null>(null);
	const [tokenInBalance, setTokenInBalance] = useState<string | null>(null);
	const [tokenOutType, setTokenOutType] = useState<string | null>(null);
	const [exchangeRate, setExchangeRate] = useState<string | null>(null);
	// const [tokenInAmount, setTokenInAmount] = useState<string>("");
	// const [tokenOutAmount, setTokenOutAmount] = useState<string | null>(null);
	const { tokenInAmount, tokenOutAmount, changeTokenAmount } = useTokenInput(
		router
	);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const handleTCFClose = () => {
		setTCFClose(false);
		setConversionList(null);
	};

	const handleTBIClose = () => {
		setTBI(false);
		setConversionList(null);
	};

	const handleTBCClose = () => {
		setTBC(false);
		setConversionList(null);
	};

	const handleTokenInSubmit = async (token: any) => {
		console.log("token in sunmitted", token);
		console.log("cr:", token.conversionRate);
		setExchangeRate(token.conversionRate);
		setTokenInType(getTokenAddress(token.name));
		let balance = await getTokenBalance(account, getTokenAddress(token.name));
		balance === null
			? setTokenInBalance("0.0")
			: setTokenInBalance(balance.substr(0, 5));
		setTCFClose(false);
		setTBI(true);
	};

	const changeTokenType = (tokenName: string, tokenType: string) => {
		return;
	};

	// const changeTokenInAmount = (_val: string) => {
	// 	const abi = JSON.stringify(IERC20.abi);
	// 	if (tokenInBalance !== null) {
	// 		if (parseInt(_val) > parseInt(tokenInBalance)) {
	// 			return;
	// 		}
	// 	}
	// 	if (_val === "") {
	// 		setTokenInAmount("");
	// 	} else {
	// 		setTokenInAmount(_val);
	// 		//in this part, I am just getting amount of token out for given token in amount
	// 		if (tokenInType !== null && tokenOutType !== null) {
	// 			loadContractInstance(abi, tokenInType).then(
	// 				(token: Contract | undefined) => {
	// 					if (token !== undefined) {
	// 						let temp = new TokenAmount(
	// 							stringToBigIntString(_val, 18),
	// 							18,
	// 							getTokenName(tokenInType),
	// 							token
	// 						);
	// 						let val = getAmountOut(router, tokenInType, tokenOutType, temp);
	// 						val.then((val) => {
	// 							if (val !== undefined) {
	// 								setTokenOutAmount(bigIntStringToString(val, 18));
	// 							} else {
	// 								console.log("value is undefined");
	// 							}
	// 						});
	// 					}
	// 				}
	// 			);
	// 		}
	// 	}
	// };
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("in", tokenInAmount, " out", tokenOutAmount);
		const abi = JSON.stringify(IERC20.abi);
		//will not do anything on submit if both input fields are empty
		if (tokenInAmount === "") {
			enqueueSnackbar("Swappy: Token In amount cannot be empty", {
				variant: "error",
				autoHideDuration: 2000,
			});
			return;
		} else if (tokenOutAmount === "" || tokenOutAmount === "0") {
			enqueueSnackbar("Swappy: Token Out amount cannot be empty", {
				variant: "error",
				autoHideDuration: 2000,
			});
			return;
		}
		if (tokenInType === null || tokenOutAmount === null) {
			return;
		}
		if (tokenOutType === null || tokenInAmount === null) {
			return;
		} else {
			const tokenInInstance = await loadContractInstance(abi, tokenInType);
			const tokenOutInstance = await loadContractInstance(abi, tokenOutType);
			if (tokenInInstance !== undefined) {
				if (tokenOutInstance !== undefined) {
					const amountInput: TokenAmount = new TokenAmount(
						stringToBigIntString(tokenInAmount.toString(), 18),
						18,
						getTokenName(tokenInType),
						tokenInInstance
					);
					const amountOutput: TokenAmount = new TokenAmount(
						stringToBigIntString(tokenOutAmount.toString(), 18),
						18,
						getTokenName(tokenOutType),
						tokenOutInstance
					);
					approveTokenAmount(amountInput, router.address).then(async () => {
						enqueueSnackbar(
							`Swappy: ${getTokenName(tokenInType)} approve Tx sent`,
							{
								variant: "info",
								autoHideDuration: 2000,
							}
						);
						swapExactTokensForTokens(
							router,
							amountInput,
							amountOutput,
							account,
							slippage,
							timeLimit
						).then((tx) => {
							//do this task when tx confirmed
							tx.wait().then(() => {
								enqueueSnackbar("Swappy: Swap tokens transaction confirmed", {
									variant: "success",
									autoHideDuration: 3000,
								});
								loadTokenBalances(account).then((_balances) => {
									setBalances(_balances);
								});
							});
							//display tx is sent
							enqueueSnackbar(`Swappy: Swap Tx sent`, {
								variant: "info",
								autoHideDuration: 2000,
							});
							//open next modal
							setTBI(false);
							setTBC(true);
						});
					});
				} else {
					console.log("token not loaded");
					enqueueSnackbar("Swappy: Some problem occured while swapping", {
						variant: "error",
						autoHideDuration: 2000,
					});
				}
			} else {
				console.log("token not loaded");
				enqueueSnackbar("Swappy: Some problem occured while swapping", {
					variant: "error",
					autoHideDuration: 2000,
				});
			}
		}
	};

	return (
		<>
			<TokenConvertFrom
				open={tokenConvertFromOpen}
				handleTokenInSubmit={handleTokenInSubmit}
				handleClose={handleTCFClose}
				data={conversionList}
			/>
			{tokenInType !== null && tokenInBalance !== null ? (
				<TokenBuyInput
					open={TBIOpen}
					// handleClose={handleTBIClose}
					// handleInputSubmit={handleSubmit}
					// tokenInName={getTokenName(tokenInType)}
					// tokenInBalance={tokenInBalance}
					// tokenInAmount={tokenInAmount}
					// changeTokenInAmount={changeTokenInAmount}
					// exchangeRate={exchangeRate}
					// tokenOutType={tokenOutType}
					tokenInType={tokenInType}
					tokenOutType={tokenOutType}
					tokenInAmount={tokenInAmount}
					tokenOutAmount={tokenOutAmount}
					changeTokenType={changeTokenType}
					changeTokenAmount={changeTokenAmount}
					areTokenSame={false}
					handleSubmit={handleSubmit}
					exchangeRate={exchangeRate}
				/>
			) : (
				" "
			)}
			{tokenInType !== null &&
			tokenOutAmount !== null &&
			tokenInAmount !== null &&
			tokenOutAmount !== null ? (
				<TokenBuyCheckout
					open={TBCOpen}
					handleClose={handleTBCClose}
					tokenInType={tokenInType}
					tokenOutType={tokenOutType}
					tokenInAmount={tokenInAmount}
					tokenOutAmount={tokenOutAmount}
					exchangeRate={exchangeRate}
				/>
			) : (
				""
			)}
		</>
	);
}

const matchStateToProps = (state: StateInterface) => {
	return {
		conversionList: state.conversionList,
		account: state.account,
		router: state.router,
		slippage: state.slippage,
		timeLimit: state.timeLimit,
	};
};

const matchDispatchToProps = (dispatch: Dispatch) => {
	return {
		setConversionList: (conversionList: ConversionList[] | null) => {
			dispatch({ type: "SET CONVERSION LIST", conversionList: conversionList });
		},
		setBalances: (balances: PriceList[]) => {
			dispatch({ type: "SET BALANCES", balances: balances });
		},
	};
};

export default connect(matchStateToProps, matchDispatchToProps)(SecondarySwap);
