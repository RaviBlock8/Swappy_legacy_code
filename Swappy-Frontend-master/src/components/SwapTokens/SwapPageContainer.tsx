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
	setBalances: (balances: PriceList[]) => void;
}

function SwapPageContainer({
	account,
	routerAddress,
	router,
	factory,
	slippage,
	balances,
	setBalances,
}: any) {
	const [exchangeRate, setExchangeRate] = useState(" ");
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
					enqueueSnackbar("Pair doesn't exists for token pair", {
						variant: "error",
					});
				} else {
					const filter = pairContract.filters.DrawTokens(
						null,
						null,
						null,
						null,
						null,
						account
					);
					//here is the code which will execute when transaction gets confirmed
					pairContract.on(
						filter,
						async (
							sender: any,
							token1In: any,
							token2In: any,
							token1Out: any,
							token2Out: any,
							to: any,
							event: any
						) => {
							console.log("event:", event);
							console.log("to:", to.toString());
							console.log("sender:", sender.toString());
							enqueueSnackbar("Swap tokens transaction approved", {
								variant: "info",
							});
							let _balances = await loadTokenBalances(account);
							console.log("balance list:", balances);
							setBalances(_balances);
						}
					);
				}
			}
		);
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
								console.log(exchangeRateString);
								setExchangeRate(exchangeRateString);
							}
						}
					);
				}
			}
		);
		return exchangeRateString;
	};
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		console.log("in", tokenInAmount, " out", tokenOutAmount);
		//will not do anything on submit if both input fields are empty
		if (tokenInAmount === "" || tokenOutAmount === "") {
			return;
		}
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
					enqueueSnackbar(`${getTokenName(tokenInType)} approve Tx sent`, {
						variant: "info",
					});
					swapExactTokensForTokens(
						router,
						amountInput,
						amountOutput,
						account,
						slippage
					).then(() => {
						enqueueSnackbar(`Swap Tx sent`, { variant: "info" });
					});
				});
			} else {
				console.log("token not loaded");
			}
		} else {
			console.log("token not loaded");
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
