import JSBI from 'jsbi';
import { Contract } from 'ethers';

export class TokenAmount {
	numerator: JSBI;
	denominator: JSBI;
	symbol: string;
	decimal: number;
	public readonly token: Contract;

	constructor(value: string, decimals: number, symbol: string, token: Contract) {
		this.numerator = JSBI.BigInt(value);
		this.denominator = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals));
		this.symbol = symbol;
		this.token = token;
		this.decimal = decimals
	}

	get bigInt(): JSBI {
		return this.numerator;
	}

	get number(): number {
		let value = JSBI.divide(this.numerator, this.denominator);
		return JSBI.toNumber(value);
	}

	getDecimal = () => {
		return this.decimal
	}

	addAtDecimal = (value: string, decimal: number) => {
		this.numerator = JSBI.add(this.numerator, JSBI.multiply(JSBI.BigInt(value), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimal))));
	}

	subtractAtDecimal = (value: string, decimal: number) => {
		this.numerator = JSBI.subtract(this.numerator, JSBI.multiply(JSBI.BigInt(value), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimal))));
	}

	multiplyByTenPower = (power: number) => {
		this.numerator = JSBI.multiply(this.numerator, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(power)));
	}
}
export default TokenAmount;
