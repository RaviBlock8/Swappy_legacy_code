import { Contract } from "ethers";
import { PriceList } from "../utils/loadTokenBalances";

const initalState = {
	account: "",
	factory: {},
	router: {},
	balances: null,
	slippage: 20,
};

export interface StateInterface {
	account: String;
	factory: Contract;
	router: Contract;
	balances: PriceList[] | null;
	slippage: number;
}

// takes the action and current state as argument and returns the updated state
const rootReducer = (state = initalState, action: any) => {
	switch (action.type) {
		case "SET_ACCOUNT":
			return {
				...state,
				account: action.account,
			};
		case "SET_FACTORY":
			return {
				...state,
				factory: action.factory,
			};
		case "SET_ROUTER":
			return {
				...state,
				router: action.router,
			};
		case "SET BALANCES":
			return {
				...state,
				balances: action.balances,
			};
		case "SET SLIPPAGE":
			return {
				...state,
				slippage: action.slippage,
			};
		default:
			return state;
	}
};

export default rootReducer;
