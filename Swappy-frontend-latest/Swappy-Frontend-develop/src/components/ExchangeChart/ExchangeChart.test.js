import React from "react";
import { mount } from "enzyme";
import ExchangeChart from "./ExchangeChart";

describe("Unit tests for ExchangeChart component", () => {
	it("tests whether component mounts correctly or not", () => {
		mount(<ExchangeChart />);
	});
});
