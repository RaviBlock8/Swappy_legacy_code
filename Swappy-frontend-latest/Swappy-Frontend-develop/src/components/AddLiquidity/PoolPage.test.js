import React from "react";
import { mount } from "enzyme";
import PoolPage from "./PoolPage";
import sinon from "sinon";

describe("Unit test for PoolPage", () => {
	let tokenInType = "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735";
	let tokenOutType = "0x03ca8ddb9509d21286433d0cb29e61e35754c1ce";
	let amountOftokenInType = "100";
	let amountOftokenOutType = "200";
	let changeTokenType = sinon.fake();
	let changePoolTokenAmount = sinon.fake();
	let errorMsg = "";
	let areTokenSame = false;
	let handleSubmit = sinon.fake();
	it("tests that component mounts", () => {
		mount(
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
		);
	});
	it("tests props values are passed correctly", () => {
		let wrapper = mount(
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
		);
		expect(wrapper.props().tokenInType).toEqual(tokenInType);
		expect(wrapper.props().tokenOutType).toEqual(tokenOutType);
		expect(wrapper.props().amountOftokenInType).toEqual(amountOftokenInType);
		expect(wrapper.props().amountOftokenOutType).toEqual(amountOftokenOutType);
		expect(wrapper.props().areTokenSame).toEqual(areTokenSame);
		expect(wrapper.props().errorMsg).toEqual(errorMsg);
	});

	it("tests if handleSubmit is called on submit", () => {
		let wrapper = mount(
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
		);
		wrapper.find("form").simulate("submit");
		expect(handleSubmit).toHaveProperty("callCount", 1);
	});

	it("tests if changePoolTokenAmount is called on tokenIn amount change", () => {
		let wrapper = mount(
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
		);
		wrapper.find("input").at(0).simulate("change");
		expect(changePoolTokenAmount).toHaveProperty("callCount", 1);
	});

	it("tests if changePoolTokenAmount is called on tokenOut amount change", () => {
		let wrapper = mount(
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
		);
		wrapper.find("input").at(1).simulate("change");
		expect(changePoolTokenAmount).toHaveProperty("callCount", 1);
	});
});
