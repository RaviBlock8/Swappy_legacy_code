import React from "react";
import { Paper, Box, Button, InputBase } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

export default function TokenBuyInput() {
	return (
		<TokenBuyCard>
			<TopHeader>
				<span style={{ fontWeight: "bold", color: "black" }}>EUR</span> TO{" "}
				<span style={{ fontWeight: "bold", color: "black" }}>BIT</span>{" "}
				CONVERSION
			</TopHeader>
			<SubHeader>
				Available{" "}
				<span style={{ fontWeight: "bold", color: "black" }}>EUR</span>
			</SubHeader>
			<AvailableCoins>54.34</AvailableCoins>
			<SubHeader>
				Amount in{" "}
				<span style={{ fontWeight: "bold", color: "black" }}>BTC</span>
			</SubHeader>
			<AmountInput
				inputProps={{ style: { textAlign: "center", fontSize: "40px" } }}
			/>
			<ConversionInfoCard>
				Currency: United States Dollar
				<br />
				Conversion Rate: 810.0
			</ConversionInfoCard>
			<ConvertButton>DONE</ConvertButton>
			<ProgressContainer>
				<GreyProgress />
				<BlueProgress />
			</ProgressContainer>
		</TokenBuyCard>
	);
}

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
	marginLeft: "auto",
	marginRight: "auto",
	marginTop: "20px",
}));

const ConvertButton = styled(Button)(({ theme }) => ({
	width: "340px",
	height: "60px",
	color: "white",
	marginTop: "31px",
	background: "#4677F5",
	borderRadius: "200px",
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
	marginLeft: "auto",
	marginRight: "auto",
	marginTop: "40px",
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
