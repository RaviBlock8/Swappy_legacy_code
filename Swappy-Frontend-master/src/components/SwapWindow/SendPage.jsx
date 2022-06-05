import React from "react";
import { styled } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

export default function SendPage() {
	return <SendPageBox>Upcoming feauture</SendPageBox>;
}

const SendPageBox = styled(Box)(({ theme }) => ({
	width: "420px",
	height: "415px",
}));
