import React, { useState, useRef, createRef } from "react";
import useHorizontal from "@oberon-amsterdam/horizontal/hook";
import TokenCard from "../TokenCard/TokenCard";
import SecondarySwap from "../SecondarySwap/SecondarySwap";
import { Box } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import TokenData from "./TokenData";
import getConvertFromRateList from "../../utils/getConvertFromRateList";
import { connect } from "react-redux";
import { PriceList } from "../../utils/loadTokenBalances";
import { ConversionList } from "../../store/reducer";
import { Contract } from "ethers";
import { StateInterface } from "../../store/reducer";
import { Dispatch } from "redux";
import SecondSwapLoader from "./SecondSwapLoader";

// interface IProps {
// 	balances: PriceList[] | null;
// 	conversionList: ConversionList[] | null;
// 	router: Contract;
// 	setConversionList: any;
// }

function CardsContainer({
	balances,
	conversionList,
	router,
	setConversionList,
}) {
	const [container, setContainer] = useState();
	const [renderSwap, setRender] = useState(false);
	const [walletLoad, setWalletLoad] = useState(false);
	const [selectedBuyToken, setSelectedBuyToken] = useState(null);
	useHorizontal({ container: container });
	const handleStartSwap = async (tokenName) => {
		console.log("initially:", conversionList);
		setWalletLoad(true);
		setRender(true);
		setSelectedBuyToken(tokenName);
		let _conversionList = await getConvertFromRateList(tokenName, router);
		console.log("conversion list:", _conversionList);
		setConversionList(_conversionList);
		setWalletLoad(false);
	};
	return (
		<>
			<OuterCardsContainer
				component="div"
				className="container"
				ref={(ref) => {
					setContainer(ref);
				}}
				// ref={cf}
			>
				{balances?.map((token) => {
					return (
						<div className="block">
							<TokenCard
								name={token.name}
								amount={token.balance.substring(0, 7)}
								startSwap={handleStartSwap}
								key={token.name}
							/>
						</div>
					);
				})}
			</OuterCardsContainer>
			{renderSwap && conversionList !== null ? (
				<SecondarySwap tokenName={selectedBuyToken} setRender={setRender} />
			) : walletLoad ? (
				<SecondSwapLoader />
			) : null}
		</>
	);
}

const OuterCardsContainer = styled(Box)(({ theme }) => ({
	margin: "0px",
	padding: "20px",
	display: "flex",
	background: "#ffffff",
	maxWidth: "none",
}));

const matchStateToProps = (state) => {
	return {
		balances: state.balances,
		conversionList: state.conversionList,
		router: state.router,
	};
};

const matchDispatchToProps = (dispatch) => {
	return {
		setConversionList: (conversionList) => {
			dispatch({ type: "SET CONVERSION LIST", conversionList: conversionList });
		},
	};
};

export default connect(matchStateToProps, matchDispatchToProps)(CardsContainer);
