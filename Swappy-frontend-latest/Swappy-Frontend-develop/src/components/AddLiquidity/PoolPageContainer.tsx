import React, { useEffect } from "react";
import PoolPage from "./PoolPage";
import { connect } from "react-redux";
import { StateInterface } from "../../store/reducer";
import { approveTokenAmount } from "../../utils/approveUtils";
import ERC20JSON from "../../abis/IERC20.json";
import useSelectTokenType from "../../logicHooks/useSelectTokenType";
import { loadContractInstance } from "../../utils/getWeb3";
import TokenAmount from "../../utils/entities/TokenAmount";
import getTokenName from "../../utils/getTokenName";
import { stringToBigIntString } from "../../utils/stringUtils";
import { Contract } from "ethers";
import { addLiquidity } from "../../utils/poolUtils";
import { Dispatch } from "redux";
import { PriceList } from "../../utils/loadTokenBalances";
import loadTokenBalances from "../../utils/loadTokenBalances";
import { useSnackbar } from "notistack";
import getPair from "../../utils/getPair";
import useTokenInput from "../../logicHooks/usePoolTokenInput";

interface IPoolPageContainer {
	routerAddress: string;
	router: Contract;
	account: string;
	balances: PriceList[] | null;
	slippage: number;
	factory: Contract;
	timeLimit: number;
	setBalances: (balances: PriceList[]) => void;
}
const PoolPageContainer = ({
	routerAddress,
	router,
	account,
	balances,
	slippage,
	factory,
	timeLimit,
	setBalances,
}: IPoolPageContainer) => {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const {
		tokenInType,
		tokenOutType,
		errorMsg,
		areTokenSame,
		changeTokenType,
	} = useSelectTokenType();
	const {
		amountOftokenInType,
		amountOftokenOutType,
		changePoolTokenAmount,
	} = useTokenInput(router);
	useEffect(() => {
		if (areTokenSame || tokenInType === " " || tokenOutType === " ") {
			return;
		}
		getPair(factory, account, tokenInType, tokenOutType).then(
			(pairContract) => {
				if (pairContract === null) {
					enqueueSnackbar("Swappy: Pair doesn't exists for token pair", {
						variant: "error",
						autoHideDuration: 3000,
					});
				}
			}
		);
		if (amountOftokenInType != "") {
			/**The reason we have done this is, so that if we have typed value and then we
			 * change token type, I want to update output balance
			 */
			changePoolTokenAmount(
				amountOftokenInType,
				"in",
				tokenInType,
				tokenOutType,
				areTokenSame
			);
		}
	}, [tokenInType, tokenOutType]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("1", amountOftokenInType, "2", amountOftokenOutType);
		if (amountOftokenInType === "" || amountOftokenInType === "0") {
			enqueueSnackbar("Swappy: Value of Token A cannot be empty", {
				variant: "error",
				autoHideDuration: 3000,
			});
			return;
		} else if (amountOftokenOutType === "" || amountOftokenOutType === "0") {
			enqueueSnackbar("Swappy: Value of Token B cannot be empty", {
				variant: "error",
				autoHideDuration: 3000,
			});
			return;
		} else if (areTokenSame) {
			enqueueSnackbar(
				"Swappy: Please make sure types of token selected are different from each other",
				{ variant: "error", autoHideDuration: 3000 }
			);
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
						addLiquidity(
							router,
							amount1,
							amount2,
							account,
							slippage,
							timeLimit
						).then((tx) => {
							enqueueSnackbar("Swappy: Add liquidity transaction sent", {
								variant: "info",
								autoHideDuration: 3000,
							});
							changePoolTokenAmount(
								"",
								"in",
								tokenInType,
								tokenOutType,
								areTokenSame
							);
							tx.wait().then(() => {
								enqueueSnackbar("Swappy: Add liquidity transaction confirmed", {
									variant: "success",
									autoHideDuration: 3000,
								});
								loadTokenBalances(account).then((_balances) => {
									setBalances(_balances);
								});
							});
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
				changePoolTokenAmount={changePoolTokenAmount}
				areTokenSame={areTokenSame}
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
)(PoolPageContainer);
