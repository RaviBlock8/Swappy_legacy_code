import { mount } from "enzyme";
import TokenCard from "./TokenCard";
import React from "react";
describe("unit tests for TokenCard", () => {
	it("tests if component mounts", () => {
		mount(<TokenCard />);
	});
	it("tests if props are passed correctly", () => {
		let token = {
			name: "ETH",
			amount: "1000",
		};
		const wrapper = mount(
			<TokenCard name={token.name} amount={token.amount} />
		);
		expect(wrapper.props().name).toEqual("ETH");
		expect(wrapper.props().amount).toEqual("1000");
	});
});
