import React from "react";
import { mount } from "enzyme";
import SwapPage from "./SwapPage";
import sinon from "sinon";

describe("Unit test for SwapPage", () => {
	let tokenInType = "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735";
	let tokenOutType = "0x03ca8ddb9509d21286433d0cb29e61e35754c1ce";
	let tokenInAmount = "123";
	let tokenOutAmount = "456";
	let changeTokenType = sinon.fake();
	let changeTokenAmount = sinon.fake();
	let errorMsg = "";
	let areTokenSame = false;
	let handleSubmit = sinon.fake();
	let exchangeRate = "1.2345";
	it("tests that component mounts", () => {
		mount(
			<SwapPage
				changeTokenType={changeTokenType}
				changeTokenAmount={changeTokenAmount}
				errorMsg={errorMsg}
				tokenInType={tokenInType}
				tokenOutType={tokenOutType}
				tokenInAmount={tokenInAmount}
				tokenOutAmount={tokenOutAmount}
				exchangeRate={exchangeRate}
				areTokenSame={areTokenSame}
				handleSubmit={handleSubmit}
			/>
		);
	});
	it("tests props values are passed correctly", () => {
		let wrapper = mount(
			<SwapPage
				changeTokenType={changeTokenType}
				changeTokenAmount={changeTokenAmount}
				errorMsg={errorMsg}
				tokenInType={tokenInType}
				tokenOutType={tokenOutType}
				tokenInAmount={tokenInAmount}
				tokenOutAmount={tokenOutAmount}
				exchangeRate={exchangeRate}
				areTokenSame={areTokenSame}
				handleSubmit={handleSubmit}
			/>
		);
		expect(wrapper.props().tokenInType).toEqual(tokenInType);
		expect(wrapper.props().tokenOutType).toEqual(tokenOutType);
		expect(wrapper.props().tokenInAmount).toEqual(tokenInAmount);
		expect(wrapper.props().tokenOutAmount).toEqual(tokenOutAmount);
		expect(wrapper.props().areTokenSame).toEqual(areTokenSame);
		expect(wrapper.props().exchangeRate).toEqual(exchangeRate);
		expect(wrapper.props().errorMsg).toEqual(errorMsg);
	});

	it("tests if handleSubmit is called on submit", () => {
		let wrapper = mount(
			<SwapPage
				changeTokenType={changeTokenType}
				changeTokenAmount={changeTokenAmount}
				errorMsg={errorMsg}
				tokenInType={tokenInType}
				tokenOutType={tokenOutType}
				tokenInAmount={tokenInAmount}
				tokenOutAmount={tokenOutAmount}
				exchangeRate={exchangeRate}
				areTokenSame={areTokenSame}
				handleSubmit={handleSubmit}
			/>
		);
		wrapper.find("form").simulate("submit");
		expect(handleSubmit).toHaveProperty("callCount", 1);
	});

	it("tests if changeTokenAmount is called on tokenIn amount change", () => {
		let wrapper = mount(
			<SwapPage
				changeTokenType={changeTokenType}
				changeTokenAmount={changeTokenAmount}
				errorMsg={errorMsg}
				tokenInType={tokenInType}
				tokenOutType={tokenOutType}
				tokenInAmount={tokenInAmount}
				tokenOutAmount={tokenOutAmount}
				exchangeRate={exchangeRate}
				areTokenSame={areTokenSame}
				handleSubmit={handleSubmit}
			/>
		);
		wrapper.find("input").at(0).simulate("change");
		expect(changeTokenAmount).toHaveProperty("callCount", 1);
	});

	it("tests if changeTokenAmount is called on tokenOut amount change", () => {
		let wrapper = mount(
			<SwapPage
				changeTokenType={changeTokenType}
				changeTokenAmount={changeTokenAmount}
				errorMsg={errorMsg}
				tokenInType={tokenInType}
				tokenOutType={tokenOutType}
				tokenInAmount={tokenInAmount}
				tokenOutAmount={tokenOutAmount}
				exchangeRate={exchangeRate}
				areTokenSame={areTokenSame}
				handleSubmit={handleSubmit}
			/>
		);
		wrapper.find("input").at(1).simulate("change");
		expect(changeTokenAmount).toHaveProperty("callCount", 1);
	});
});
