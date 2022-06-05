import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import SwapWindow from "../../components/SwapWindow/SwapWindow";
import TokenExchangePrices from "../../components/TokenExchangePrices/TokenExchangePrices";
import MyWallet from "../../components/MyWallet/MyWallet";
import ConnectWallet from "../../components/ConnectWallet/ConnectWallet";
import { connect } from "react-redux";
import { StateInterface } from "../../store/reducer";
import { Dispatch } from "redux";
import { PriceList } from "../../utils/loadTokenBalances";
import loadTokenBalances from "../../utils/loadTokenBalances";
import WalletLoading from "../../components/ConnectWallet/WalletLoading";
import { makeStyles } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";

interface IProps {
	account: string;
	balances: PriceList[] | null;
	setBalances: (balances: PriceList[]) => void;
}
function OpenPage({ account, balances, setBalances }: any) {
	const [connected, setConnected] = useState(false);
	const handleConnected = async () => {
		if (account !== "" || account !== undefined) {
			let balances = await loadTokenBalances(account);
			console.log("balance list:", balances);
			setBalances(balances);
		}
	};
	const useStyles = makeStyles({
		success: { backgroundColor: "#41c236" },
		info: {
			backgroundColor: "#4946F5",
		},
	});
	const classes = useStyles();
	useEffect(() => {
		if (connected) {
			handleConnected()
				.then(() => {
					console.log("done");
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [connected]);
	useEffect(() => {
		window.ethereum.on("accountsChanged", async () => {
			setBalances(null);
			setConnected(false);
		});
	}, []);
	return (
		<SnackbarProvider
			classes={{
				variantSuccess: classes.success,
				variantInfo: classes.info,
			}}
			maxSnack={4}
		>
			<MainScreen>
				<SwapWindow />
				{/* <TokenExchangePrices /> */}
				{connected && balances !== null ? (
					<MyWallet balances={balances} />
				) : connected ? (
					<WalletLoading />
				) : (
					<ConnectWallet setConnected={setConnected} />
				)}
			</MainScreen>
		</SnackbarProvider>
	);
}

const MainScreen = styled(Box)(({ theme }) => ({
	width: "100vw",
	height: "95vh",
	boxSizing: "border-box",
	paddingTop: "35px",
	display: "flex",
	justifyContent: "center",
}));

const matchStateToProps = (state: StateInterface) => {
	return {
		balances: state.balances,
		account: state.account,
	};
};

const matchDispatchToProps = (dispatch: Dispatch) => {
	return {
		setBalances: (balances: PriceList[]) => {
			dispatch({ type: "SET BALANCES", balances: balances });
		},
	};
};

export default connect(matchStateToProps, matchDispatchToProps)(OpenPage);
