import { Contract } from "ethers";
import JSBI from "jsbi";
import TokenAmount from "./entities/TokenAmount";
import { bigIntStringToString } from "./stringUtils";

const getAmountIn = async (router: Contract, inputToken: string, outputToken: string, outputAmount: TokenAmount)  => {
	try {
		const reserves = await router.functions.getReserves(inputToken, outputToken)
		const inputReserve = JSBI.BigInt(reserves[0]);
		const outputReserve = JSBI.BigInt(reserves[1]);
		let numerator = JSBI.multiply(outputAmount.bigInt, inputReserve);
		numerator = JSBI.multiply(numerator, JSBI.BigInt(1000));
		let denominator = JSBI.subtract(outputReserve, outputAmount.bigInt);
		denominator = JSBI.multiply(denominator, JSBI.BigInt(997));
		return JSBI.divide(numerator, denominator).toString();
	} catch(error) {
		console.log("Error: ", error);
	}
}

const getAmountOut = async (router: Contract, inputToken: string, outputToken: string, inputAmount: TokenAmount)  => {
	try {
		const reserves = await router.functions.getReserves(inputToken, outputToken)
		const inputReserve = JSBI.BigInt(reserves[0]);
		const outputReserve = JSBI.BigInt(reserves[1]);
		let numerator = JSBI.multiply(inputAmount.bigInt, outputReserve);
		numerator = JSBI.multiply(numerator, JSBI.BigInt(997));
		let denominator = JSBI.multiply(inputReserve, JSBI.BigInt(1000));
		denominator = JSBI.add(denominator, JSBI.multiply(inputAmount.bigInt, JSBI.BigInt(997)));
		return JSBI.divide(numerator, denominator).toString();
	} catch(error) {
		console.log("Error: ", error);
	}
}

const swapExactTokensForTokens = async(router: Contract, inputAmount: TokenAmount, minOutputAmount: TokenAmount, account: string, slippage: number) => {
	try {
		let balance = await inputAmount.token.functions.balanceOf(account)
		if(JSBI.lessThan(balance, inputAmount.bigInt)) {
			throw new Error("Insufficient Balance")
		}
		let allowance = await inputAmount.token.functions.allowance(account, router.address)
		if(JSBI.lessThan(allowance, inputAmount.bigInt)) {
			throw new Error("Insufficient Allowance")
		}
		let minimumPercentage = 100 - slippage;
		console.log(minimumPercentage)
		console.log(minOutputAmount.numerator.toString())

		minimumPercentage = Math.floor(minimumPercentage);
		minOutputAmount.numerator =  JSBI.multiply(minOutputAmount.numerator, JSBI.BigInt(minimumPercentage));
		minOutputAmount.numerator = JSBI.divide(minOutputAmount.numerator, JSBI.BigInt(100));

		console.log(minimumPercentage)
		console.log(minOutputAmount.numerator.toString())
		const result = await router.functions.swapExactTokensForTokens(
			inputAmount.bigInt.toString(),
			minOutputAmount.bigInt.toString(),
			inputAmount.token.address,
			minOutputAmount.token.address,
			account,
			"10000000000000",
			{ "gasLimit": window.web3.utils.toHex(210000) }
		)
		console.log(result);
	} catch(error) {
		console.log("Error: ", error)
	}
}

export { getAmountIn, getAmountOut, swapExactTokensForTokens }
