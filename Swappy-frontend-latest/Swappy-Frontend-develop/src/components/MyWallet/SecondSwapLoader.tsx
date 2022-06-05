import React from "react";
import { Modal, CircularProgress } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { styled } from "@material-ui/core/styles";

export default function SecondSwapLoader() {
	return (
		<ModalCon
			open={true}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={true}>
				<CustomCircularProgress />
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
const CustomCircularProgress = styled(CircularProgress)(({ theme }) => ({
	// background: "white",
	color: "white",
}));
