import React from "react";
import { Paper, Box, Button, InputBase } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import data from "./data";
import TokenTable from "./TokenTable";

export default function TokenConvertFrom() {
	return (
		<TokenBuyCard>
			<SubHeader>convert from</SubHeader>
			<TokenTable data={data} />
			<ProgressContainer>
				<BlueProgress />
				<GreyProgress />
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
const SubHeader = styled(Box)(({ theme }) => ({
	width: "180px",
	height: "28px",
	fontSize: "24px",
	lineHeight: "28px",
	textAlign: "center",
	textTransform: "uppercase",
	display: "block",
	marginLeft: "auto",
	marginRight: "auto",
	marginBottom: "31px",
	color: "#BDBDBD",
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
