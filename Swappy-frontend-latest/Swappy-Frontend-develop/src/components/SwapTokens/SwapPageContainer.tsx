import React, { useEffect, useState } from "react";
import SwapPage from "./SwapPage";
import useSelectTokenType from "../../logicHooks/useSelectTokenType";
import useTokenInput from "../../logicHooks/useTokenInput";
import { connect } from "react-redux";
import {
	stringToBigIntString,
	bigIntStringToString,
} from "../../utils/stringUtils";
import { useSnackbar } from "notistack";
import getPair from "../../utils/getPair";
import ERC20JSON from "../../abis/IERC20.json";
import { loadContractInstance } from "../../utils/getWeb3";
import TokenAmount from "../../utils/entities/TokenAmount";
import { getAmountOut, swapExactTokensForTokens } from "../../utils/swapUtils";
import getTokenName from "../../utils/getTokenName";
import { approveTokenAmount } from "../../utils/approveUtils";
import { Contract } from "ethers";
import { StateInterface } from "../../store/reducer";
import { Dispatch } from "redux";
import { PriceList } from "../../utils/loadTokenBalances";
import loadTokenBalances from "../../utils/loadTokenBalances";

interface IProps {
	account: string;
	routerAddress: string;
	router: Contract;
	factory: Contract;
	slippage: number;
	balances: PriceList[] | null;
	timeLimit: number;
	setBalances: (balances: PriceList[]) => void;
}

function SwapPageContainer({
	account,
	routerAddress,
	router,
	factory,
	slippage,
	balances,
	timeLimit,
	setBalances,
}: IProps) {
	const [exchangeRate, setExchangeRate] = useState<string>(" ");
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const {
		tokenInType,
		tokenOutType,
		errorMsg,
		areTokenSame,
		changeTokenType,
	} = useSelectTokenType();
	const { tokenInAmount, tokenOutAmount, changeTokenAmount } = useTokenInput(
		router
	);
	useEffect(() => {
		if (areTokenSame || tokenInType === " " || tokenOutType === " ") {
			return;
		}
		getExchangeRates();
		getPair(factory, account, tokenInType, tokenOutType).then(
			(pairContract) => {
				if (pairContract === null) {
					enqueueSnackbar("Swappy: Pair doesn't exists for this token pair", {
						variant: "error",
						autoHideDuration: 2000,
					});
				}
			}
		);
		if (tokenInAmount != "") {
			/**The reason we have done this is, so that if we have typed value and then we
			 * change token type, I want to update output balance
			 */
			changeTokenAmount(
				tokenInAmount,
				"in",
				tokenInType,
				tokenOutType,
				areTokenSame
			);
		}
	}, [tokenInType, tokenOutType]);

	const getExchangeRates = (): string => {
		let exchangeRateString = " ";
		console.log(getTokenName(tokenInType) + ":" + tokenInType);
		console.log(getTokenName(tokenOutType) + ":" + tokenOutType);
		loadContractInstance(JSON.stringify(ERC20JSON.abi), tokenInType).then(
			(token) => {
				if (token !== undefined) {
					let val = new TokenAmount(
						stringToBigIntString("1", 18),
						18,
						getTokenName(tokenInType),
						token
					);
					getAmountOut(router, tokenInType, tokenOutType, val).then(
						(amountOut) => {
							if (amountOut !== undefined) {
								exchangeRateString =
									"1 " +
									getTokenName(tokenInType) +
									" = " +
									bigIntStringToString(amountOut, 18).substring(0, 10) +
									" " +
									getTokenName(tokenOutType);
								setExchangeRate(exchangeRateString);
							}
						}
					);
				}
			}
		);
		return exchangeRateString;
	};
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("in", tokenInAmount, " out", tokenOutAmount);
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
		} else if (areTokenSame) {
			enqueueSnackbar("Swappy: Both tokens can't be of same type", {
				variant: "error",
				autoHideDuration: 2000,
			});
			return;
		} else {
			console.log("router address:", routerAddress);
			const tokenInInstance = await loadContractInstance(
				JSON.stringify(ERC20JSON.abi),
				tokenInType
			);
			const tokenOutInstance = await loadContractInstance(
				JSON.stringify(ERC20JSON.abi),
				tokenOutType
			);
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
					approveTokenAmount(amountInput, routerAddress).then(async () => {
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
							tx.wait().then(() => {
								enqueueSnackbar("Swappy: Swap tokens transaction confirmed", {
									variant: "success",
									autoHideDuration: 3000,
								});
								loadTokenBalances(account).then((_balances) => {
									setBalances(_balances);
								});
							});
							enqueueSnackbar(`Swappy: Swap Tx sent`, {
								variant: "info",
								autoHideDuration: 2000,
							});
							changeTokenAmount(
								"",
								"in",
								tokenInType,
								tokenOutType,
								areTokenSame
							);
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
		<SwapPage
			changeTokenType={changeTokenType}
			changeTokenAmount={changeTokenAmount}
			errorMsg={errorMsg}
			tokenInType={tokenInType}
			tokenOutType={tokenOutType}
			tokenInAmount={tokenInAmount}
			tokenOutAmount={tokenOutAmount}
			exchangeRate={exchangeRate}
			areTokenSame={areTokenSame}
			handleSubmit={handleSubmit}
		/>
	);
}

const matchStateToProps = (state: StateInterface) => {
	return {
		account: state.account,
		routerAddress: state.router.address,
		router: state.router,
		factory: state.factory,
		slippage: state.slippage,
		balances: state.balances,
		timeLimit: state.timeLimit,
	};
};

const matchDispatchToProps = (dispatch: Dispatch) => {
	return {
		setBalances: (balances: PriceList[]) => {
			dispatch({ type: "SET BALANCES", balances: balances });
		},
	};
};

export default connect(
	matchStateToProps,
	matchDispatchToProps
)(SwapPageContainer);
