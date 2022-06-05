import React from "react";
import { CircularProgress } from "@material-ui/core";
import { styled } from "@material-ui/core";

export default function WalletLoading() {
	return <CustomCircularProgress />;
}

const CustomCircularProgress = styled(CircularProgress)(({ theme }) => ({
	position: "absolute",
	top: "91vh",
}));
