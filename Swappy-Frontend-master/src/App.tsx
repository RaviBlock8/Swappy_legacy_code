import React, { Component } from "react";
import "./App.css";
import SwappyFactoryJSON from "./abis/ISwappyFactory.json";
import SwappyRouterJSON from "./abis/ISwappyRouter.json";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
	loadWeb3,
	getAccountInformation,
	loadContractInstance,
	getNetworkId,
} from "./utils/getWeb3";
import { Contract } from "ethers";
import { Contracts } from "./addresses/contracts";
import OpenPage from "./pages/openPage/OpenPage";
import SlippagePanel from "./components/Settings/SettingsPanel";

interface IProps {
	factory: Contract;
	router: Contract;
	account: String;
	setAccountAddress: (account: String) => void;
	setFactoryInstance: (contract: Contract) => void;
	setRouterInstance: (contract: Contract) => void;
}

interface IState {}

class App extends Component<IProps, IState> {
	state = {
		error: null,
	};
	async componentDidMount() {
		await this.refreshWeb3();
	}

	async refreshWeb3() {
		try {
			await loadWeb3();
			const account = await getAccountInformation();
			if (account !== undefined) {
				this.props.setAccountAddress(account);
				// let priceList: PriceList[] = await loadTokenBalances(account);
				// console.log("price list:", priceList);
			}
			const networkId = await getNetworkId();
			const factoryContract = await loadContractInstance(
				JSON.stringify(SwappyFactoryJSON.abi),
				Contracts[networkId].factory
			);

			const routerContract = await loadContractInstance(
				JSON.stringify(SwappyRouterJSON.abi),
				Contracts[networkId].router
			);

			if (factoryContract !== undefined) {
				this.props.setFactoryInstance(factoryContract);
			}
			if (routerContract !== undefined) {
				this.props.setRouterInstance(routerContract);
			}
			window.ethereum.on("accountsChanged", async () => {
				await this.refreshWeb3();
				alert("Account Changed");
			});
		} catch (error) {
			this.setState({ error: error.toString() });
		}
	}

	render() {
		if (this.state.error) {
			return <h1>{this.state.error}</h1>;
		} else {
			return (
				<div className="App">
					<SlippagePanel />
					<OpenPage />
				</div>
			);
		}
	}
}

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
		setAccountAddress: (account: String) =>
			dispatch({ type: "SET_ACCOUNT", account: account }),
		setFactoryInstance: (factory: Contract) =>
			dispatch({ type: "SET_FACTORY", factory: factory }),
		setRouterInstance: (router: Contract) =>
			dispatch({ type: "SET_ROUTER", router: router }),
	};
};

export default connect(null, mapDispatchToProps)(App);

declare global {
	interface Window {
		ethereum: any;
		web3: any;
	}
}
