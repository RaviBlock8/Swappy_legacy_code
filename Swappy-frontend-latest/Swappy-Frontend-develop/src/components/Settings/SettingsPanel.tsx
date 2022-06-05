import React, { useState } from "react";
import { Box, Icon, Modal, Paper } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import SettingsIcon from "./SettingsIcon";
import SlippageModal from "./SlippageModal";

export default function SettingsPanel() {
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<>
			<Panel>
				<Icon>
					<SettingsIcon
						color="#fafafa"
						style={{ cursor: "pointer" }}
						onClick={handleOpen}
					/>
				</Icon>
			</Panel>
			<SlippageModal open={open} handleClose={handleClose} />
		</>
	);
}

const Panel = styled(Box)(({ theme }) => ({
	width: "98.5vw",
	height: "5vh",
	padding: "5px",
	boxSizing: "border-box",
	display: "block",
	textAlign: "right",
}));
