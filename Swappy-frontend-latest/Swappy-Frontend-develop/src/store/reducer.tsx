import { Contract } from "ethers";
import { PriceList } from "../utils/loadTokenBalances";

export interface ConversionList {
	name: string;
	conversionRate: string;
}

const initalState = {
	account: "",
	factory: {},
	router: {},
	balances: null,
	slippage: 20,
	timeLimit: 6,
	conversionList: null,
};

export interface StateInterface {
	account: string;
	factory: Contract;
	router: Contract;
	balances: PriceList[] | null;
	slippage: number;
	timeLimit: number;
	conversionList: ConversionList[] | null;
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
		case "SET TIME LIMIT":
			return {
				...state,
				timeLimit: action.timeLimit,
			};
		case "SET CONVERSION LIST":
			return {
				...state,
				conversionList: action.conversionList,
			};
		default:
			return state;
	}
};

export default rootReducer;
