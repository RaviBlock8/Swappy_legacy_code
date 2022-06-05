import React from "react";
import { Paper, Box, Button, InputBase, Modal } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { styled } from "@material-ui/core/styles";
import getTokenName from "../../utils/getTokenName";
import SwapPage from "../SwapTokens/SwapPage";

export default function TokenBuyInput({
	open,
	handleClose,
	// handleInputSubmit,
	// tokenInName,
	// tokenInBalance,
	// tokenInAmount,
	// changeTokenInAmount,
	// tokenOutType,
	// exchangeRate,
	tokenInType,
	tokenOutType,
	tokenInAmount,
	tokenOutAmount,
	changeTokenType,
	changeTokenAmount,
	areTokenSame,
	handleSubmit,
	exchangeRate,
}: any) {
	return (
		<ModalCon
			open={open}
			// onClose={handleClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={open}>
				<SwapPage
					tokenInType={tokenInType}
					tokenOutType={tokenOutType}
					tokenInAmount={tokenInAmount}
					tokenOutAmount={tokenOutAmount}
					changeTokenType={changeTokenType}
					changeTokenAmount={changeTokenAmount}
					areTokenSame={false}
					errorMsg={" "}
					handleSubmit={handleSubmit}
					exchangeRate={exchangeRate}
				/>
			</Fade>
		</ModalCon>
	);
}

const ModalCon = styled(Modal)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	border: "none",
	borderRadius: "12px",
}));

const TokenBuyCard = styled(Paper)(({ theme }) => ({
	width: "600px",
	height: "600px",
	background: "#FFFFFF",
	boxShadow: "4px 4px 40px rgba(0, 0, 0, 0.25)",
	borderRadius: "20px",
	paddingTop: "40px",
	boxSizing: "border-box",
	margin: "5px",
}));

const TopHeader = styled(Box)(({ theme }) => ({
	width: "314px",
	height: "18px",
	fontSize: "24px",
	lineHeight: "28px",
	textAlign: "center",
	textTransform: "uppercase",
	display: "block",
	marginLeft: "auto",
	marginRight: "auto",
	marginBottom: "50px",
	color: "#BDBDBD",
}));
const SubHeader = styled(Box)(({ theme }) => ({
	width: "147px",
	height: "21px",
	fontSize: "18px",
	lineHeight: "21px",
	textAlign: "center",
	textTransform: "uppercase",
	display: "block",
	marginLeft: "auto",
	marginRight: "auto",
	color: "#BDBDBD",
}));

const AmountInput = styled(InputBase)(({ theme }) => ({
	width: "480px",
	height: "70px",
	display: "block",
	marginTop: "30px",
	border: "2px solid #4677F5",
	boxSizing: "border-box",
	borderRadius: "200px",
	marginLeft: "auto",
	marginRight: "auto",
	padding: "3px",
	textAlign: "center",
}));

const ConversionInfoCard = styled(Box)(({ theme }) => ({
	width: "239px",
	height: "21px",
	fontSize: "18px",
	lineHeight: "21px",
	textAlign: "center",
	color: "#BDBDBD",
	display: "block",
	marginLeft: "auto",
	marginRight: "auto",
	marginTop: "20px",
}));

const ConvertButton = styled(Button)(({ theme }) => ({
	width: "340px",
	height: "60px",
	color: "white",
	marginTop: "48px",
	background: "#4677F5",
	borderRadius: "200px",
	display: "block",
	marginLeft: "auto",
	marginRight: "auto",
}));

const BlueProgress = styled(Box)(({ theme }) => ({
	width: "100px",
	height: "0px",
	display: "inline-block",
	border: "2px solid #4677F5",
}));
const GreyProgress = styled(Box)(({ theme }) => ({
	width: "100px",
	height: "0px",
	display: "inline-block",
	border: "2px solid #E4E4E4",
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
	width: "250px",
	height: "5px",
	display: "block",
	marginLeft: "auto",
	marginRight: "auto",
	marginTop: "26px",
}));

const AvailableCoins = styled(Box)(({ theme }) => ({
	width: "187px",
	height: "84px",
	display: "block",
	fontSize: "72px",
	lineHeight: "84px",
	textAlign: "center",
	marginLeft: "auto",
	marginRight: "auto",
	color: "#000000",
	marginTop: "10px",
	marginBottom: "38px",
}));
