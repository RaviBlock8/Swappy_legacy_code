import React from "react";
import {
	Paper,
	Table,
	TableBody,
	TableRow,
	TableCell,
	Typography,
	Box,
} from "@material-ui/core";
import { styled, makeStyles } from "@material-ui/core/styles";
import DollarSVG from "./DollarSVG";

export default function TokenTable({ data }) {
	const classes = useStyles();
	return (
		<TokenTableCon>
			{data.map((token) => (
				<TableRow key={token.tokenName} className={classes.tr}>
					<TableCell component="th" scope="token">
						<TokenName>
							<SvgBox>
								<DollarSVG />
							</SvgBox>{" "}
							{token.tokenName}
						</TokenName>
					</TableCell>
					<TableCell align="right">
						<ConversionRate className={classes.cr}>
							Conversion rate: {token.conversionRate}
						</ConversionRate>
					</TableCell>
				</TableRow>
			))}
		</TokenTableCon>
	);
}

const TokenTableCon = styled(Table)(({ theme }) => ({
	maxHeight: "420px",
	maxWidth: "480px",
	marginLeft: "auto",
	marginRight: "auto",
}));

const TokenName = styled(Typography)(({ theme }) => ({
	fontSize: "24px",
	lineHeight: "28x",
	fontWeight: "bold",
}));

const ConversionRate = styled(Typography)(({ theme }) => ({
	fontSize: "18px",
	lineHeight: "21x",
	color: "#bdbdbd",
}));

const SvgBox = styled(Box)(({ theme }) => ({
	borderRadius: "50%",
	border: "2px solid #4677F5",
	display: "inline-block",
	width: "30px",
	height: "30px",
	textAlign: "center",
}));

const useStyles = makeStyles({
	tr: {
		transition: "background 500ms",
		"&:hover": {
			background: "#4677F5",
			cursor: "pointer",
			color: "white",
		},
	},
});
