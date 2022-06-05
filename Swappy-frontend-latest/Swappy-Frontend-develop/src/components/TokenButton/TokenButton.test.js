import React from "react";
import TokenButton from "./TokenButton";
import { mount } from "enzyme";

describe("Unit tests for TokenButton", () => {
	it("tests whether TokenButton successfully mounts or not", () => {
		mount(<TokenButton />);
	});
});
