import TokenAmount from './entities/TokenAmount';
import { ethers } from 'ethers';
import _ from 'lodash';
// import _ from 'lodash';

const approveTokenAmount = async (tokenAmount: TokenAmount, delegate: string) : Promise<void> => {
	try {
		const token = tokenAmount.token;
		let approvalTokenAmount = new TokenAmount(tokenAmount.numerator.toString(), tokenAmount.decimal, tokenAmount.symbol, tokenAmount.token);
		console.log(approvalTokenAmount.bigInt.toString())
		approvalTokenAmount.addAtDecimal("1", approvalTokenAmount.getDecimal());
		let tx = await token.approve(delegate, approvalTokenAmount.bigInt.toString());
    console.log('transactionHash is ', tx);
	} catch(error) {
		throw error
	}
}

export { approveTokenAmount }
