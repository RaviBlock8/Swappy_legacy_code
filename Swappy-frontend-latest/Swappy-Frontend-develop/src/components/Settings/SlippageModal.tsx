import React from "react";
import {
	Modal,
	Paper,
	Button,
	InputBase,
	Typography,
	Box,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { connect } from "react-redux";
import { StateInterface } from "../../store/reducer";
import { Dispatch } from "redux";

interface IProps {
	open: boolean;
	handleClose: any;
	slippage: number;
	timeLimit: number;
	setTimeLimit: any;
	setSlippage: any;
}

function SlippageModal({
	open,
	handleClose,
	slippage,
	setSlippage,
	timeLimit,
	setTimeLimit,
}: IProps) {
	return (
		<SlippageModalCon
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			open={open}
			onClose={handleClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={open}>
				<>
					<SlippagePaper elevation={3}>
						<Label>SLIPPAGE</Label>
						<InputField
							id="slippageInput"
							placeholder="0"
							type="number"
							value={slippage}
							inputProps={{ min: "0" }}
							onChange={(e) => {
								if (
									isNaN(Number(e.target.value)) ||
									Number(e.target.value) > 100
								) {
									return;
								}
								setSlippage(Number(e.target.value));
							}}
						/>
						<br />
						<SlippageButton
							color="primary"
							onClick={() => setSlippage(5)}
							variant={slippage === 5 ? "contained" : "outlined"}
							size="large"
							style={{ margin: "3px", borderRadius: "7px", outline: "none" }}
						>
							5%
						</SlippageButton>
						<SlippageButton
							type="submit"
							color="primary"
							onClick={() => setSlippage(10)}
							variant={slippage === 10 ? "contained" : "outlined"}
							size="large"
							style={{ borderRadius: "7px", outline: "none" }}
						>
							10%
						</SlippageButton>
						<SlippageButton
							type="submit"
							color="primary"
							onClick={() => setSlippage(20)}
							variant={slippage === 20 ? "contained" : "outlined"}
							size="large"
							style={{ margin: "3px", borderRadius: "7px", outline: "none" }}
						>
							20%
						</SlippageButton>
					</SlippagePaper>
					{/*Time Limit setting */}
					<SlippagePaper elevation={3} style={{ marginLeft: "5px" }}>
						<Label>TIME LIMIT</Label>
						<InputField
							id="timeInput"
							placeholder="0"
							type="number"
							inputProps={{ min: "0" }}
							value={timeLimit}
							onChange={(e) => {
								setTimeLimit(e.target.value);
							}}
						/>
						<br />
						<SlippageButton
							color="primary"
							onClick={() => setTimeLimit(1)}
							variant={timeLimit === 1 ? "contained" : "outlined"}
							size="large"
							style={{ margin: "3px", borderRadius: "7px", outline: "none" }}
						>
							1 min
						</SlippageButton>
						<SlippageButton
							type="submit"
							color="primary"
							onClick={() => setTimeLimit(6)}
							variant={timeLimit === 6 ? "contained" : "outlined"}
							size="large"
							style={{ borderRadius: "7px", outline: "none" }}
						>
							6 min
						</SlippageButton>
						<SlippageButton
							type="submit"
							color="primary"
							onClick={() => setTimeLimit(10)}
							variant={timeLimit === 10 ? "contained" : "outlined"}
							size="large"
							style={{ margin: "3px", borderRadius: "7px", outline: "none" }}
						>
							10 min
						</SlippageButton>
					</SlippagePaper>
				</>
			</Fade>
		</SlippageModalCon>
	);
}

const SlippageModalCon = styled(Modal)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	border: "none",
}));

const Label = styled(Box)(({ theme }) => ({
	height: "21px",
	display: "block",
	fontSize: "18px",
	lineHeight: "21px",
	textAlign: "center",
	fontWeight: "bold",
}));

const SlippagePaper = styled(Paper)(({ theme }) => ({
	paddingTop: "15px",
	border: "none",
	textAlign: "center",
	borderRadius: "7px",
}));

const SlippageButton = styled(Button)(({ theme }) => ({
	fontSize: "21px",
	background: "linear-gradient(125.53deg, #8AABFF -8.3%, #B795FF 78.77%)",
	borderRadius: "0px",
	borderTopLeftRadius: "5px",
	borderTopRightRadius: "5px",
}));
const InputField = styled(InputBase)(({ theme }) => ({
	width: "110px",
	// border: "1px solid black",
	height: "75px",
	boxSizing: "border-box",
	fontSize: "64px",
	lineHeight: "75px",
	color: "#c0c0c0",
	fontWeight: "bold",
	marginLeft: "40px",
	marginRight: "auto",
	textAlign: "right",
}));

const matchStateToProps = (state: StateInterface) => {
	return {
		slippage: state.slippage,
		timeLimit: state.timeLimit,
	};
};
const matchDispatchToProps = (dispatch: Dispatch) => {
	return {
		setSlippage: (slippage_val: number) => {
			dispatch({ type: "SET SLIPPAGE", slippage: slippage_val });
		},
		setTimeLimit: (_timeLimit: number) => {
			dispatch({ type: "SET TIME LIMIT", timeLimit: _timeLimit });
		},
	};
};
export default connect(matchStateToProps, matchDispatchToProps)(SlippageModal);
