import React from "react";
import { Paper, Box, Typography } from "@material-ui/core";
import { styled, makeStyles } from "@material-ui/core/styles";
import data from "./data";

export default function TokenExchangePrices() {
	const classes = useStyles();
	return (
		<TokenCard>
			{data.map((tokenPair, index) => {
				return (
					<TokenPairPriceBox key={index} className={classes.tr}>
						<IconBox>
							<img
								src={
									tokenPair.up ? require("./green.png") : require("./red.png")
								}
								alt="image can't be loaded"
							/>
						</IconBox>
						<TokenPairInfo>
							<TokenPairName>{`${tokenPair.token1}/${tokenPair.token2}`}</TokenPairName>
							<TokenPairPrice>{tokenPair.price}</TokenPairPrice>
							<PricePercentage>{tokenPair.perc}</PricePercentage>
						</TokenPairInfo>
					</TokenPairPriceBox>
				);
			})}
		</TokenCard>
	);
}

const TokenCard = styled(Paper)(({ theme }) => ({
	width: "730px",
	height: "480px",
	background: "#FFFFFF",
	boxShadow: "4px 4px 40px rgba(0, 0, 0, 0.25)",
	borderRadius: "20px",
	paddingTop: "75px",
	boxSizing: "border-box",
	margin: "5px",
	display: "flex",
	flexWrap: "wrap",
	justifyContent: "space-evenly",
	cursor: "pointer",
}));

const TokenPairPriceBox = styled(Box)(({ theme }) => ({
	width: "216px",
	height: "83px",
	//   background: "#F3F3F3",
	borderRadius: "12px",
	padding: "18px",
	boxSizing: "border-box",
	display: "flex",
	justifyContent: "space-evenly",
	alignContent: "space-evenly",
}));

const IconBox = styled(Box)(({ theme }) => ({
	width: "47px",
	height: "47px",
	// background: "black",
}));

const TokenPairInfo = styled(Box)(({ theme }) => ({
	width: "86px",
	textAlign: "left",
}));

const TokenPairName = styled(Typography)(({ theme }) => ({
	fontSize: "18px",
	lineHeight: "21px",
	fontWeight: "bolder",
}));

const TokenPairPrice = styled(Typography)(({ theme }) => ({
	fontSize: "14px",
	lineHeight: "16px",
	fontWeight: "bold",
}));

const PricePercentage = styled(Typography)(({ theme }) => ({
	fontSize: "12px",
	lineHeight: "14px",
}));

const useStyles = makeStyles({
	tr: {
		transition: "background 500ms",
		"&:hover": {
			background: "#F3F3F3",
		},
	},
});
