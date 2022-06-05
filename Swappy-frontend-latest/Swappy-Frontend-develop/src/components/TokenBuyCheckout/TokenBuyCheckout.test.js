import React from "react";
import { mount } from "enzyme";
import TokenBuyCheckout from "./TokenBuyCheckout";

describe("Unit tests for TokenBuyCheckout component", () => {
	it("tests whether component mounts correctly", () => {
		mount(<TokenBuyCheckout />);
	});
});
