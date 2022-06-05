import { Contract } from "ethers";
import TokenAmount from "./entities/TokenAmount";
import JSBI from "jsbi";

const getQuote = async (
	router: Contract,
	inputAddress: string,
	outputAddress: string,
	tokenAmount: TokenAmount
) => {
	try {
		const reserves = await router.functions.getReserves(
			inputAddress,
			outputAddress
		);
		const inputReserve = JSBI.BigInt(reserves[0]);
		const outputReserve = JSBI.BigInt(reserves[1]);
		if (tokenAmount.bigInt === JSBI.BigInt(0)) {
			throw new Error("Token1 supplied amount should be greater than 0");
		}
		if (inputReserve === JSBI.BigInt(0) || inputReserve === JSBI.BigInt(0)) {
			return tokenAmount.bigInt.toString();
		}
		return JSBI.divide(
			JSBI.multiply(outputReserve, tokenAmount.bigInt),
			inputReserve
		).toString();
	} catch (error) {
		console.log("Error: ", error);
	}
};

const addLiquidity = async (
	router: Contract,
	token1Amount: TokenAmount,
	token2Amount: TokenAmount,
	account: string,
	slippage: number
) => {
	try {
		let balance = await token1Amount.token.functions.balanceOf(account);
		if (JSBI.lessThan(balance, token1Amount.bigInt)) {
			throw new Error("Insufficient token1 Balance");
		}

		balance = await token2Amount.token.functions.balanceOf(account);
		if (JSBI.lessThan(balance, token2Amount.bigInt)) {
			throw new Error("Insufficient token2 Balance");
		}

		let allowance = await token1Amount.token.functions.allowance(
			account,
			router.address
		);
		if (JSBI.lessThan(allowance, token1Amount.bigInt)) {
			throw new Error("Insufficient token1 Allowance");
		}

		allowance = await token2Amount.token.functions.allowance(
			account,
			router.address
		);
		if (JSBI.lessThan(allowance, token2Amount.bigInt)) {
			throw new Error("Insufficient token2 Allowance");
		}
		let token1AmountMin = new TokenAmount(
			token1Amount.bigInt.toString(),
			token1Amount.decimal,
			token1Amount.symbol,
			token1Amount.token
		);
		let token2AmountMin = new TokenAmount(
			token2Amount.bigInt.toString(),
			token2Amount.decimal,
			token2Amount.symbol,
			token2Amount.token
		);
		let minimumPercentage = 100 - slippage;

		minimumPercentage = Math.floor(minimumPercentage);
		token1AmountMin.numerator = JSBI.multiply(
			token1AmountMin.numerator,
			JSBI.BigInt(minimumPercentage)
		);
		token1AmountMin.numerator = JSBI.divide(
			token1AmountMin.numerator,
			JSBI.BigInt(100)
		);

		token2AmountMin.numerator = JSBI.multiply(
			token2AmountMin.numerator,
			JSBI.BigInt(minimumPercentage)
		);
		token2AmountMin.numerator = JSBI.divide(
			token2AmountMin.numerator,
			JSBI.BigInt(100)
		);

		const result = await router.functions.addLiquidty(
			token1Amount.token.address,
			token2Amount.token.address,
			token1Amount.bigInt.toString(),
			token2Amount.bigInt.toString(),
			token1AmountMin.bigInt.toString(),
			token2AmountMin.bigInt.toString(),
			account,
			"100000000000",
			{ gasLimit: window.web3.utils.toHex(210000) }
		);
		console.log(result);
	} catch (error) {
		console.log("Error: ", error);
	}
};

const removeLiquidity = async (
	router: Contract,
	liquidityTokenAmount: TokenAmount,
	account: string,
	token1: string,
	token2: string
) => {
	try {
		let balance = await liquidityTokenAmount.token.functions.balanceOf(account);
		console.log(balance.toString());
		if (JSBI.lessThan(balance, liquidityTokenAmount.bigInt)) {
			throw new Error("Insufficient Balance");
		}
		const result = await router.functions.removeLiquidity(
			token1,
			token2,
			liquidityTokenAmount.bigInt.toString(),
			"0",
			"0",
			account,
			"100000000000",
			{ gasLimit: window.web3.utils.toHex(210000) }
		);
		console.log(result);
	} catch (error) {
		console.log("Error: ", error);
	}
};

export { getQuote, addLiquidity, removeLiquidity };
