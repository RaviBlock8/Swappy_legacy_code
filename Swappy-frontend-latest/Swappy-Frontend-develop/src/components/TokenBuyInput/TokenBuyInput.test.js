import React from "react";
import { mount } from "enzyme";
import TokenBuyInput from "./TokenBuyInput";

describe("Unit tests for TokenBuyInput component", () => {
	it("tests whether component mounts correctly", () => {
		mount(<TokenBuyInput />);
	});
});
