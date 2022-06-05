import React, { useState } from "react";
import { mount } from "enzyme";
import ConnectWallet from "./ConnectWallet.jsx";
import sinon from "sinon";

describe("Tests for ConnectWallet component", () => {
	it("tests that component did mount", () => {
		mount(<ConnectWallet />);
	});

	it("tests if setConnected prop is called", () => {
		const setConnected = sinon.fake();
		const wrapper = mount(<ConnectWallet setConnected={setConnected} />);
		wrapper.simulate("click");
		expect(setConnected).toHaveProperty("callCount", 1);
	});
});
