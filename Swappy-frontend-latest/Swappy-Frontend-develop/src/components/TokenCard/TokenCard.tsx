import React from "react";
import { Paper, Box } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import TokenButton from "../TokenButton/TokenButton";
import getConvertRateList from "../../utils/getConvertFromRateList";
import { StateInterface } from "../../store/reducer";
import { connect } from "react-redux";
import { Contract } from "ethers";

interface IProps {
	name: string;
	amount: string;
	startSwap: (tokenName: string) => void;
}
function TokenCard({ name, amount, startSwap }: IProps) {
	return (
		<div style={{ width: "240px", marginLeft: "30px" }}>
			<TokenPaper component="div">
				<InfoIcon>
					<img src={require("./info.png")} />
				</InfoIcon>
				<TokenHeading>{name}</TokenHeading>
				<TokenValue>{amount}</TokenValue>
				<TokenBalanceLabel>YOUR BALANCE</TokenBalanceLabel>
			</TokenPaper>
			<TokenButton
				clickHandler={() => {
					startSwap(name);
				}}
			/>
		</div>
	);
}

const TokenPaper = styled(Paper)(({ theme }) => ({
	width: "240px",
	height: "255px",
	boxSizing: "border-box",
	background: "#FFFFFF",
	border: "1px solid #4677F5",
	borderRadius: "18px",
	paddingTop: "20px",
	marginLeft: "auto",
	marginRight: "auto",
	marginBottom: "20px",
}));

const InfoIcon = styled(Box)(({ theme }) => ({
	width: "14px",
	height: "14px",
	marginLeft: "206px",
}));

const TokenHeading = styled(Box)(({ theme }) => ({
	width: "73px",
	height: "47px",
	fontSize: "40px",
	lineHeight: "47px",
	fontWeight: "lighter",
	/* identical to box height */
	marginLeft: "auto",
	marginRight: "auto",
	textAlign: "center",
}));

const TokenValue = styled(Box)(({ theme }) => ({
	// width: "152px",
	height: "56px",
	fontWeight: "bold",
	fontSize: "48px",
	lineHeight: "56px",
	textAlign: "center",
	marginLeft: "auto",
	marginRight: "auto",
	marginTop: "30px",
	color: "#000000",
}));

const TokenBalanceLabel = styled(Box)(({ theme }) => ({
	// width: "170px",
	height: "28px",
	fontSize: "24px",
	lineHeight: "28px",
	fontWeight: "lighter",
	textAlign: "center",
	marginLeft: "auto",
	marginRight: "auto",
	marginTop: "30px",
}));

export default TokenCard;
