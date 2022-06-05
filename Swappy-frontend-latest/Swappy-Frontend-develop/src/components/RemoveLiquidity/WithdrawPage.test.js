import React from "react";
import { mount } from "enzyme";
import WithdrawPage from "./WithdrawPage";
import sinon from "sinon";

describe("Unit tests for withdraw liquidity page", () => {
	let handleSubmit = sinon.fake();
	let liquidityTokens = "123";
	let changeAmountOfLiquidityTokens = sinon.fake();
	let tokenInType = "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735";
	let tokenOutType = "0x03ca8ddb9509d21286433d0cb29e61e35754c1ce";
	let changeTokenType = sinon.fake();
	let exchangeRate = null;
	let tokenAInReturn = null;
	let tokenBInReturn = null;
	it("tests if withdraw liquidity page mounts", () => {
		mount(
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
	});
	it("tests if props value are passed correctly", () => {
		const wrapper = mount(
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
		expect(wrapper.props().liquidityTokens).toEqual(liquidityTokens);
		expect(wrapper.props().tokenInType).toEqual(tokenInType);
		expect(wrapper.props().tokenOutType).toEqual(tokenOutType);
		expect(wrapper.props().exchangeRate).toEqual(exchangeRate);
		expect(wrapper.props().tokenAInReturn).toEqual(tokenAInReturn);
		expect(wrapper.props().tokenBInReturn).toEqual(tokenBInReturn);
	});

	it("tests if changeAmountOfLiquidityTokens is called when typing liquidity tokens amount", () => {
		let wrapper = mount(
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
		wrapper.find("input").at(0).simulate("change");
		expect(changeAmountOfLiquidityTokens).toHaveProperty("callCount", 1);
	});

	it("tests if handleSubmit is called when submit button pressed", () => {
		let wrapper = mount(
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
		wrapper.find("form").simulate("submit");
		expect(handleSubmit).toHaveProperty("callCount", 1);
	});
});
