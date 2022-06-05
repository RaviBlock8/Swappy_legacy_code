import React from "react";
import { Button } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import DollarSvg from "./DollarSvg";

function TokenButton({ clickHandler }) {
	return (
		<TButton onClick={clickHandler} style={{ outline: "none" }}>
			{/* <DollarSvg />
			&nbsp;*/} Get more
		</TButton>
	);
}

const TButton = styled(Button)(({ theme }) => ({
	background: "linear-gradient(109.39deg, #4677F5 0%, #4946F5 100%)",
	boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.12)",
	borderRadius: "18px",
	width: "240px",
	height: "58px",
	fontSize: "17px",
	lineHeight: "23px",
	fontWeight: "bold",
	color: "white",
	display: "flex",
	alignContent: "space-evenly",
	justifyContent: "center",
	textTransform: "capitalize",
	outline: "none",
	"&:hover": {
		background:
			"linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%), linear-gradient(109.39deg, #4677F5 0%, #4946F5 100%)",
		boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.12)",
		borderRadius: "18px",
		color: "#4677F5",
	},
}));

export default TokenButton;
