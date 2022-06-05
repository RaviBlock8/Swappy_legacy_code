import React from "react";
import { Paper, Box, Button, Modal } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { styled } from "@material-ui/core/styles";
import CheckSVG from "./CheckSVG";
import getTokenName from "../../utils/getTokenName";

export default function TokenBuyCheckout({
	open,
	handleClose,
	tokenInType,
	tokenOutType,
	tokenInAmount,
	tokenOutAmount,
	exchangeRate,
}: any) {
	return (
		<ModalCon
			open={open}
			onClose={handleClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={open}>
				<TokenBuyCard component="div">
					<Checkout>
						<CheckSVG />
					</Checkout>
					<SubHeader>Successfully Converted</SubHeader>
					<FromCard>{tokenInAmount.substr(0, 4)}</FromCard>
					<ToSubheader>To</ToSubheader>
					<ToCard>{tokenOutAmount.substr(0, 4)}</ToCard>
					<ConversionInfoCard>
						Currency: {getTokenName(tokenInType)}
						<br />
						Conversion Rate: {exchangeRate.substr(0, 4)}
					</ConversionInfoCard>
					<ConvertButton
						style={{ outline: "none" }}
						onClick={() => {
							handleClose();
						}}
					>
						DONE
					</ConvertButton>
				</TokenBuyCard>
			</Fade>
		</ModalCon>
	);
}

const ModalCon = styled(Modal)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	border: "none",
}));

const TokenBuyCard = styled(Paper)(({ theme }) => ({
	width: "600px",
	height: "600px",
	background: "#FFFFFF",
	boxShadow: "4px 4px 40px rgba(0, 0, 0, 0.25)",
	borderRadius: "20px",
	paddingTop: "64px",
	boxSizing: "border-box",
}));

const Checkout = styled(Box)(({ theme }) => ({
	width: "110px",
	height: "110px",
	marginLeft: "250px",
	marginRight: "230px",
}));

const SubHeader = styled(Box)(({ theme }) => ({
	width: "314px",
	height: "28px",
	fontSize: "24px",
	lineHeight: "28px",
	textAlign: "center",
	textTransform: "uppercase",
	display: "block",
	marginTop: "33px",
	marginLeft: "auto",
	marginRight: "auto",
	color: "#BDBDBD",
}));

const FromCard = styled(Box)(({ theme }) => ({
	width: "180px",
	height: "90px",
	display: "inline-block",
	marginLeft: "76px",
	background: "rgba(244, 84, 49, 0.1)",
	borderRadius: "10px",
	marginTop: "54px",
	fontSize: "40px",
	lineHeight: "47px",
	boxSizing: "border-box",
	padding: "16px",
	textAlign: "center",
}));

const ToCard = styled(Box)(({ theme }) => ({
	width: "180px",
	height: "90px",
	display: "inline-block",
	background: "rgba(104, 238, 109, 0.14);",
	borderRadius: "10px",
	marginTop: "54px",
	fontSize: "40px",
	lineHeight: "47px",
	boxSizing: "border-box",
	padding: "16px",
	textAlign: "center",
}));

const ToSubheader = styled(Box)(({ theme }) => ({
	fontSize: "24px",
	lineHeight: "28px",
	height: "80px",
	width: "80px",
	textAlign: "center",
	display: "inline-block",
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
}));

const ConvertButton = styled(Button)(({ theme }) => ({
	width: "340px",
	height: "60px",
	color: "white",
	marginTop: "60px",
	background: "#4677F5",
	borderRadius: "200px",
	display: "block",
	marginLeft: "auto",
	marginRight: "auto",
}));
