import React from "react";
import { Paper, Box, Button, InputBase, Modal } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { styled } from "@material-ui/core/styles";
import TokenTable from "./TokenTable";
import { StateInterface, ConversionList } from "../../store/reducer";
import { connect } from "react-redux";

interface IProps {
	open: boolean;
	handleClose: () => void;
	handleTokenInSubmit: (token: any) => void;
	data: ConversionList[];
}

const TokenConvertFrom = ({
	open,
	handleClose,
	handleTokenInSubmit,
	data,
}: IProps) => {
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
				<TokenBuyCard>
					<SubHeader>convert from</SubHeader>
					<TokenTable data={data} handleTokenInSubmit={handleTokenInSubmit} />
					<ProgressContainer>
						<BlueProgress />
						<GreyProgress />
					</ProgressContainer>
				</TokenBuyCard>
			</Fade>
		</ModalCon>
	);
};

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
	// boxShadow: "4px 4px 40px rgba(0, 0, 0, 0.25)",
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
	display: "block",
	marginLeft: "auto",
	marginRight: "auto",
	marginTop: "20px",
}));

export default TokenConvertFrom;
