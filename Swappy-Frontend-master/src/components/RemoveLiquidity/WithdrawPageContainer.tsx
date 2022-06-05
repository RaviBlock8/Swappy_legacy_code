import React, { useState, useEffect } from "react";
// import PoolPage from "./PoolPage";

import { connect } from "react-redux";
import { StateInterface } from "../../store/reducer";
import { approveTokenAmount } from "../../utils/approveUtils";
import useSelectTokenType from "../../logicHooks/useSelectTokenType";

import ERC20JSON from "../../abis/IERC20.json";
import { loadContractInstance } from "../../utils/getWeb3";
import TokenAmount from "../../utils/entities/TokenAmount";
import getTokenName from "../../utils/getTokenName";
import {
	stringToBigIntString,
	bigIntStringToString,
} from "../../utils/stringUtils";
import { Contract } from "ethers";
import { removeLiquidity } from "../../utils/poolUtils";
import DollarSvg from "../SwapWindow/DollarSvg";
import pairEvents from "../../utils/getPair";
import WithdrawPage from "./WithdrawPage";
import { useSnackbar } from "notistack";
import getLiquidityTokens from "../../utils/getLiquidityTokens";
import { Dispatch } from "redux";
import { PriceList } from "../../utils/loadTokenBalances";
import loadTokenBalances from "../../utils/loadTokenBalances";
import getPair from "../../utils/getPair";

interface IProps {
	account: string;
	routerAddress: string;
	router: Contract;
	factory: Contract;
	slippage: number;
}
const WithdrawPageContainer = ({
	routerAddress,
	router,
	account,
	factory,
	slippage,
	balances,
	setBalances,
}: any) => {
	//input type value state
	const [liquidityTokens, setLiquidityTokens] = useState("");
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const [exchangeRate, setExchangeRate] = useState(" ");
	//select token handlers
	const {
		tokenInType,
		tokenOutType,
		errorMsg,
		areTokenSame,
		changeTokenType,
	} = useSelectTokenType();
	//handle when user enter input amount
	const changeAmountOfLiquidityTokens: any = (event: any) => {
		console.log("value:", event.target.value);
		let amount = event.target.value;

		let num = /^-?\d*\.?\d*$/;
		if (areTokenSame || tokenInType === " " || tokenOutType === " ") {
			return;
		}
		//if user is typing any characters do not allow him to type
		if (amount.match(num)) {
			console.log("contain numbers");
		} else {
			return;
		}
		if (amount === "") {
			setLiquidityTokens("0.00");
		} else {
			setLiquidityTokens(event.target.value);
		}
	};

	const setLiquidityTokensFunc = () => {
		getLiquidityTokens(tokenInType, tokenOutType, account, factory).then(
			(lqd_amount) => {
				if (lqd_amount === null) {
					enqueueSnackbar("Pair doesn't exists for token pair", {
						variant: "error",
					});
				} else {
					let LiquidityTokensString = lqd_amount.substring(0, 10);
					console.log(LiquidityTokensString);
					setExchangeRate(LiquidityTokensString);
				}
			}
		);
	};

	useEffect(() => {
		console.log("withdraw use effect starts.......");
		if (areTokenSame || tokenInType === " " || tokenOutType === " ") {
			return;
		}
		setLiquidityTokensFunc();
		//suscribing event
		getPair(factory, account, tokenInType, tokenOutType).then(
			(pairContract) => {
				if (pairContract === null) {
					enqueueSnackbar("Pair doesn't exists for token pair", {
						variant: "error",
					});
				} else {
					const filter = pairContract.filters.Burn(null, null, null, account);
					//here is the code which will execute when transaction gets confirmed
					pairContract.on(
						filter,
						async (
							sender: any,
							token1Amount: any,
							token2Amount: any,
							to: any,
							event: any
						) => {
							enqueueSnackbar("Burn liquidity transaction confirmed", {
								variant: "info",
							});
							let _balances = await loadTokenBalances(account);
							setBalances(_balances);
							setLiquidityTokensFunc();
						}
					);
				}
			}
		);
	}, [tokenInType, tokenOutType]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (liquidityTokens === "") {
			return;
		}
		try {
			console.log(liquidityTokens);
			const pairContract = await pairEvents(
				factory,
				account,
				tokenInType,
				tokenOutType
			);
			const pairAddress = pairContract?.address;
			console.log(pairAddress);
			const pairToken = await loadContractInstance(
				JSON.stringify(ERC20JSON.abi),
				pairAddress
			);
			let symbol = await pairToken?.functions.symbol();
			let decimal = await pairToken?.functions.decimals();
			console.log(decimal);
			console.log(symbol);
			if (pairToken !== undefined) {
				let liquidityTokenAmount = new TokenAmount(
					stringToBigIntString(liquidityTokens.toString(), decimal),
					decimal,
					symbol,
					pairToken
				);
				await approveTokenAmount(liquidityTokenAmount, routerAddress);
				await removeLiquidity(
					router,
					liquidityTokenAmount,
					account,
					tokenInType,
					tokenOutType
				);
				enqueueSnackbar("Burn liquidity transaction sent", {
					variant: "info",
				});
			}
		} catch (err) {
			console.log("Error:", err);
		}
	};

	return (
		// <div>
		// 	<SwapPageBox>
		// 		<form onSubmit={handleSubmit}>
		// 		<MainInputBox>
		// 		<InputBox1>
		// 			<Label>Liquidity Tokens</Label>
		// 			<InputField
		// 				value={liquidityTokens}
		// 				onChange={(e) => {
		// 					changeAmountOfLiquidityTokens(e)
		// 				}}
		// 				placeholder="0.00"
		// 			/>
		// 		</InputBox1>
		// 		</MainInputBox>
		// 		<Footer type="submit">
		// 			<DollarSvg />
		// 			{"   "}Remove Liquidity
		// 		</Footer>>
		// 	</form>
		// </SwapPageBox>
		// </div>
		<WithdrawPage
			handleSubmit={handleSubmit}
			liquidityTokens={liquidityTokens}
			changeAmountOfLiquidityTokens={changeAmountOfLiquidityTokens}
			tokenInType={tokenInType}
			tokenOutType={tokenOutType}
			changeTokenType={changeTokenType}
			exchangeRate={exchangeRate}
		/>
	);
};

const matchStateToProps = (state: StateInterface) => {
	return {
		account: state.account,
		factory: state.factory,
		routerAddress: state.router.address,
		router: state.router,
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
)(WithdrawPageContainer);
