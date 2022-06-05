import React, { useState, useEffect } from "react";
import PoolPage from "./PoolPage";
import { connect } from "react-redux";
import { StateInterface } from "../../store/reducer";
import { approveTokenAmount } from "../../utils/approveUtils";
import ERC20JSON from "../../abis/IERC20.json";
import useSelectTokenType from "../../logicHooks/useSelectTokenType";
import { loadContractInstance } from "../../utils/getWeb3";
import TokenAmount from "../../utils/entities/TokenAmount";
import getTokenName from "../../utils/getTokenName";
import {
	stringToBigIntString,
	bigIntStringToString,
} from "../../utils/stringUtils";
import { Contract } from "ethers";
import { getQuote, addLiquidity } from "../../utils/poolUtils";
import { Dispatch } from "redux";
import { PriceList } from "../../utils/loadTokenBalances";
import loadTokenBalances from "../../utils/loadTokenBalances";
import { useSnackbar } from "notistack";
import getPair from "../../utils/getPair";

interface IProps {
	account: string;
	routerAddress: string;
	router: Contract;
	factory: Contract;
	slippage: number;
}
const PoolPageContainer = ({
	routerAddress,
	router,
	account,
	slippage,
	factory,
	balances,
	setBalances,
}: any) => {
	const [amountOftokenInType, setAmountOftokenInType] = useState("");
	const [amountOftokenOutType, setAmountOftokenOutType] = useState("");
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const {
		tokenInType,
		tokenOutType,
		errorMsg,
		areTokenSame,
		changeTokenType,
	} = useSelectTokenType();

	useEffect(() => {
		if (areTokenSame || tokenInType === " " || tokenOutType === " ") {
			return;
		}
		getPair(factory, account, tokenInType, tokenOutType).then(
			(pairContract) => {
				if (pairContract === null) {
					enqueueSnackbar("Pair doesn't exists for token pair", {
						variant: "error",
					});
				} else {
					const filter = pairContract.filters.Mint(null, null, null, account);
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
							enqueueSnackbar("Add liquidity transaction confirmed", {
								variant: "info",
							});
							let _balances = await loadTokenBalances(account);
							setBalances(_balances);
						}
					);
				}
			}
		);
	}, [tokenInType, tokenOutType]);
	const changeAmountOftokenInType: any = async (event: any) => {
		if (areTokenSame || tokenInType === " " || tokenOutType === " ") {
			return;
		}

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
			setAmountOftokenInType(event.target.value);
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
						getQuote(router, tokenInType, tokenOutType, tokenInTypeAmount).then(
							(val: any) => {
								if (val !== undefined) {
									let _val = bigIntStringToString(val, 18);
									console.log("value:", _val);
									setAmountOftokenOutType(_val);
								} else {
									setAmountOftokenOutType(amount);
								}
							}
						);
					} else {
						console.log("erc20 token not found");
					}
				}
			);
		}
	};
	const changeAmountOftokenOutType: any = (event: any) => {
		if (areTokenSame || tokenInType === " " || tokenOutType === " ") {
			return;
		}
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

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		console.log("1", amountOftokenInType, "2", amountOftokenOutType);
		if (amountOftokenInType === "" || amountOftokenInType === "0") {
			if (amountOftokenOutType === "" || amountOftokenOutType === "0") {
				e.preventDefault();
				console.log("EMPTY");
				return;
			}
		} else {
			try {
				console.log("router address:", routerAddress);
				const tokenInTypeInstance = await loadContractInstance(
					JSON.stringify(ERC20JSON.abi),
					tokenInType
				);
				const tokenOutTypeInstance = await loadContractInstance(
					JSON.stringify(ERC20JSON.abi),
					tokenOutType
				);
				if (tokenInTypeInstance !== undefined) {
					if (tokenOutTypeInstance !== undefined) {
						const amount1: TokenAmount = new TokenAmount(
							stringToBigIntString(amountOftokenInType, 18),
							18,
							getTokenName(tokenInType),
							tokenInTypeInstance
						);
						const amount2: TokenAmount = new TokenAmount(
							stringToBigIntString(amountOftokenOutType, 18),
							18,
							getTokenName(tokenOutType),
							tokenOutTypeInstance
						);
						await approveTokenAmount(amount1, routerAddress);
						await approveTokenAmount(amount2, routerAddress);
						await addLiquidity(router, amount1, amount2, account, slippage);
						enqueueSnackbar("Add liquidity transaction sent", {
							variant: "info",
						});
					} else {
						console.log("token not loaded");
					}
				} else {
					console.log("token not loaded");
				}
			} catch (error) {
				console.log("Approval error: ", error);
			}
		}
	};
	return (
		<div>
			<PoolPage
				changeTokenType={changeTokenType}
				errorMsg={errorMsg}
				tokenInType={tokenInType}
				tokenOutType={tokenOutType}
				amountOftokenInType={amountOftokenInType}
				amountOftokenOutType={amountOftokenOutType}
				changeAmountOftokenInType={changeAmountOftokenInType}
				changeAmountOftokenOutType={changeAmountOftokenOutType}
				handleSubmit={handleSubmit}
			></PoolPage>
		</div>
	);
};

const matchStateToProps = (state: StateInterface) => {
	return {
		account: state.account,
		routerAddress: state.router.address,
		router: state.router,
		slippage: state.slippage,
		factory: state.factory,
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
)(PoolPageContainer);
