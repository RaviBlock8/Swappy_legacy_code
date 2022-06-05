import React from "react";
import {
	Paper,
	Table,
	TableRow,
	TableCell,
	Typography,
	Box,
	TableContainer,
} from "@material-ui/core";
import { styled, makeStyles } from "@material-ui/core/styles";
import RSC from "react-scrollbars-custom";

export default function TokenTable({ data, handleTokenInSubmit }: any) {
	const classes = useStyles();
	return (
		<RSC
			style={{
				width: "480px",
				height: "420px",
				marginLeft: "auto",
				marginRight: "auto",
			}}
		>
			<TokenTableCon>
				{data
					.filter((token: any) => token.conversionRate != null)
					.map((token: any) => (
						<TableRow
							key={token.name}
							onClick={() => {
								handleTokenInSubmit(token);
							}}
							className={classes.tr}
						>
							<TableCell component="th" scope="token">
								<TokenName>{token.name}</TokenName>
							</TableCell>
							<TableCell align="right">
								<ConversionRate className={classes.tr}>
									Conversion rate:{" "}
									{token.conversionRate !== null
										? token.conversionRate.substr(0, 8)
										: "null"}
								</ConversionRate>
							</TableCell>
						</TableRow>
					))}
			</TokenTableCon>
		</RSC>
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
