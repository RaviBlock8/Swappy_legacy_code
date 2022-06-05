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
import getTokensForLiquidityTokens from "../../utils/getTokensForLiquidityTokens";

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
const WithdrawPageContainer = ({
	routerAddress,
	router,
	account,
	factory,
	slippage,
	balances,
	timeLimit,
	setBalances,
}: IProps) => {
	//input type value state
	const [liquidityTokens, setLiquidityTokens] = useState<string>("");
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const [exchangeRate, setExchangeRate] = useState<string | null>(null);
	const [tokenAInReturn, setTokenAReturn] = useState<string | null>(null);
	const [tokenBInReturn, setTokenBReturn] = useState<string | null>(null);
	//select token handlers
	const {
		tokenInType,
		tokenOutType,
		errorMsg,
		areTokenSame,
		changeTokenType,
	} = useSelectTokenType();
	//handle when user enter input amount
	const changeAmountOfLiquidityTokens = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		let amount = event.target.value;

		let num = /^-?\d*\.?\d*$/;
		if (tokenInType === " ") {
			enqueueSnackbar("Swappy: Please select Token A type", {
				variant: "error",
				autoHideDuration: 2000,
			});
			return;
		}
		if (tokenOutType === " ") {
			enqueueSnackbar("Swappy: Please select Token B type", {
				variant: "error",
				autoHideDuration: 2000,
			});
			return;
		}
		if (areTokenSame) {
			return;
		}
		//if user is typing any characters do not allow him to type
		if (amount.match(num)) {
			console.log("contain numbers");
		} else {
			return;
		}
		if (amount === "") {
			setLiquidityTokens("");
			setTokenAReturn(null);
			setTokenBReturn(null);
		} else {
			setLiquidityTokens(event.target.value);
			//getting amount of tokens you will get for these amount of liquidity tokens
			getTokensForLiquidityTokens(
				tokenInType,
				tokenOutType,
				event.target.value,
				account,
				factory,
				router
			).then((res) => {
				if (res === null) {
					setTokenAReturn(null);
					setTokenBReturn(null);
				} else {
					setTokenAReturn(res.amountOfTokenA);
					setTokenBReturn(res.amountOfTokenB);
				}
			});
		}
	};

	const setLiquidityTokensFunc = () => {
		getLiquidityTokens(tokenInType, tokenOutType, account, factory).then(
			(lqd_amount) => {
				if (lqd_amount === null) {
					enqueueSnackbar("Swappy: Pair doesn't exists for this token pair", {
						variant: "error",
						autoHideDuration: 2000,
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
		//checking if tokens are of same type
		if (areTokenSame) {
			setExchangeRate(null);
			setTokenAReturn(null);
			setTokenBReturn(null);
			return;
		}

		if (tokenInType === " " || tokenOutType === " ") {
			return;
		}
		setLiquidityTokensFunc();

		//checking if pair exists or not
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
		//if there is some amount typed in , that show equivalent return tokens
		if (liquidityTokens != "") {
			getTokensForLiquidityTokens(
				tokenInType,
				tokenOutType,
				liquidityTokens,
				account,
				factory,
				router
			).then((res) => {
				if (res === null) {
					setTokenAReturn(null);
					setTokenBReturn(null);
				} else {
					setTokenAReturn(res.amountOfTokenA);
					setTokenBReturn(res.amountOfTokenB);
				}
			});
		}
	}, [tokenInType, tokenOutType]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (liquidityTokens === "") {
			enqueueSnackbar("Swappy: Please enter Liquidity tokens amount!", {
				variant: "error",
				autoHideDuration: 2000,
			});
			return;
		}
		if (tokenAInReturn === null || tokenBInReturn === null) {
			enqueueSnackbar("Swappy: You don't have any liquidity in this pair", {
				variant: "error",
				autoHideDuration: 2000,
			});
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
				removeLiquidity(
					router,
					liquidityTokenAmount,
					account,
					tokenInType,
					tokenOutType,
					timeLimit
				).then((tx) => {
					enqueueSnackbar("Swappy: Burn liquidity transaction sent", {
						variant: "info",
						autoHideDuration: 2000,
					});
					setTokenAReturn(null);
					setTokenBReturn(null);
					setLiquidityTokens("");
					tx.wait().then(() => {
						enqueueSnackbar("Swappy: Burn liquidity transaction confirmed", {
							variant: "success",
							autoHideDuration: 2000,
						});
						loadTokenBalances(account).then((_balances) => {
							setBalances(_balances);
						});
						setLiquidityTokensFunc();
					});
				});
			}
		} catch (err) {
			console.log("Error:", err);
			enqueueSnackbar("Swappy: Some problem occured while burning tokens", {
				variant: "error",
				autoHideDuration: 2000,
			});
		}
	};

	return (
		<WithdrawPage
			handleSubmit={handleSubmit}
			liquidityTokens={liquidityTokens}
			changeAmountOfLiquidityTokens={changeAmountOfLiquidityTokens}
			tokenInType={tokenInType}
			tokenOutType={tokenOutType}
			tokenAInReturn={tokenAInReturn}
			tokenBInReturn={tokenBInReturn}
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
)(WithdrawPageContainer);
