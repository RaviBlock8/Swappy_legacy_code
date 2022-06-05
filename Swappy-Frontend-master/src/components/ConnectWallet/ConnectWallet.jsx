import React from "react";
import { Button } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

export default function ConnectWallet({ setConnected }) {
	return (
		<ConnectWaletButton
			onClick={() => {
				setConnected(true);
			}}
			style={{outline:"none"}}
		>
			Connect wallet
		</ConnectWaletButton>
	);
}

const ConnectWaletButton = styled(Button)(({ theme }) => ({
	background: "#FFFFFF",
	border: "2px solid #4677F5",
	width: "260px",
	height: "50px",
	boxSizing: "border-box",
	borderRadius: "18px",
	position: "absolute",
	top: "90vh",
	fontSize: "18px",
	lineHeight: "28px",
	color: "#4677F5",
	textTransform: "capitalize",
}));
