import React from "react";
import { mount } from "enzyme";
import TokenExchangePrices from "./TokenExchangePrices";

describe("Unit tests for TokenExchangePrices component", () => {
	it("tests whether component mounts correctly", () => {
		mount(<TokenExchangePrices />);
	});
});
