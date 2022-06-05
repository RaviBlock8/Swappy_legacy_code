import React from "react";
import { Box, InputBase, Select, MenuItem, Button } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { TokenDataInterface, data } from "../../addresses/tokens";
import getTokenName from "../../utils/getTokenName";

interface IProps {
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	liquidityTokens: string;
	changeAmountOfLiquidityTokens: (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	tokenInType: string;
	tokenOutType: string;
	changeTokenType: (tokenName: any, tokenType: string) => void;
	exchangeRate: string | null;
	tokenAInReturn: string | null;
	tokenBInReturn: string | null;
}
export default function WithdrawPage({
	handleSubmit,
	liquidityTokens,
	changeAmountOfLiquidityTokens,
	tokenInType,
	tokenOutType,
	changeTokenType,
	exchangeRate,
	tokenAInReturn,
	tokenBInReturn,
}: IProps) {
	return (
		<SwapPageBox>
			<form onSubmit={handleSubmit}>
				<MainInputBox>
					<InputBox>
						<Label>LIQUIDITY TOKENS</Label>
						<InputField
							value={liquidityTokens}
							onChange={(e) => {
								changeAmountOfLiquidityTokens(e);
							}}
							placeholder="0.00"
							autoComplete="off"
						/>
					</InputBox>
				</MainInputBox>
				<SelectInputBox>
					<SelectC
						value={tokenInType}
						onChange={(e) => {
							changeTokenType(e.target.value, "tokenIn");
						}}
						disableUnderline={true}
					>
						{data.map((token: TokenDataInterface) => {
							return (
								<MenuItemC key={token.address} value={token.address}>
									{token.name}
								</MenuItemC>
							);
						})}
					</SelectC>
					<SelectC
						value={tokenOutType}
						onChange={(e) => {
							changeTokenType(e.target.value, "tokenOut");
						}}
						disableUnderline={true}
					>
						{data.map((token: TokenDataInterface) => {
							return (
								<MenuItemC key={token.address} value={token.address}>
									{token.name}
								</MenuItemC>
							);
						})}
					</SelectC>
				</SelectInputBox>
				{/* <ExchangePriceBox>exchangeRate</ExchangePriceBox> */}
				<ConversionInfoCard>
					LIQUIDITY TOKENS:
					<span style={{ fontWeight: "bold", color: "black" }}>
						{exchangeRate ?? " "}
					</span>
					<br />
					LIQUIDITY POOL PAIR:
					<span style={{ fontWeight: "bold", color: "black" }}>
						{getTokenName(tokenInType)}/{getTokenName(tokenOutType)}
					</span>
					<br />
					TOKEN A IN RETURN:{" "}
					<span style={{ fontWeight: "bold", color: "black" }}>
						{tokenAInReturn === null ? "0" : tokenAInReturn.substr(0, 8)}
					</span>
					<br />
					TOKEN B IN RETURN:{" "}
					<span style={{ fontWeight: "bold", color: "black" }}>
						{tokenBInReturn === null ? "0" : tokenBInReturn.substr(0, 8)}
					</span>
				</ConversionInfoCard>
				<SubmitButton type="submit" style={{ outline: "none" }}>
					Burn
				</SubmitButton>
			</form>
		</SwapPageBox>
	);
}

const SwapPageBox = styled(Box)(({ theme }) => ({
	width: "420px",
	height: "415px",
	borderBottomRightRadius: "10px",
	borderBottomLeftRadius: "10px",
	borderLeft: "1.5px solid #4677f5",
	borderRight: "1.5px solid #4677f5",
	borderBottom: "1.5px solid #4677f5",
}));

const SelectInputBox = styled(Box)(({ theme }) => ({
	width: "420px",
	boxSizing: "border-box",
	display: "flex",
	justifyContent: "space-evenly",
	// border: "1px solid black",
	marginTop: "15px",
}));

const MainInputBox = styled(Box)(({ theme }) => ({
	width: "420px",
	boxSizing: "border-box",
	display: "flex",
	justifyContent: "space-evenly",
	// border: "1px solid black",
}));

const Label = styled(Box)(({ theme }) => ({
	// width: "120px",
	height: "21px",
	display: "block",
	fontSize: "18px",
	lineHeight: "21px",
	textAlign: "center",
	fontWeight: "bold",
}));

const InputField = styled(InputBase)(({ theme }) => ({
	width: "129px",
	height: "75px",
	boxSizing: "border-box",
	fontSize: "64px",
	lineHeight: "75px",
	color: "#474747",
	fontWeight: "bold",
	marginLeft: "auto",
	marginRight: "auto",
	textAlign: "left",
}));

const InputBox = styled(Box)(({ theme }) => ({
	height: "80px",
	width: "170px",
	boxSizing: "border-box",
	marginTop: "49px",
	// border: "1px solid red",
	textAlign: "center",
}));

const SelectC = styled(Select)(({ theme }) => ({
	width: "126px",
	height: "40px",
	border: "1px solid #4677F5",
	boxSizing: "border-box",
	borderRadius: "8px",
	marginTop: "9px",
	padding: "0px",
	fontSize: "18px",
	lineHeight: "21px",
	fontWeight: "bold",
	textAlign: "center",
	marginLeft: "auto",
	marginRight: "auto",
}));

const MenuItemC = styled(MenuItem)(({ theme }) => ({
	fontSize: "18px",
	lineHeight: "21px",
	fontWeight: "bold",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
	width: "120px",
	fontSize: "15px",
	lineHeight: "28px",
	fontWeight: "bold",
	marginLeft: "auto",
	marginRight: "auto",
	marginTop: "40px",
	color: "#4677F5",
	display: "flex",
	alignContent: "space-evenly",
	justifyContent: "space-evenly",
	borderRadius: "5px",
}));

const ExchangePriceBox = styled(Box)(({ theme }) => ({
	width: "350px",
	height: "21px",
	marginLeft: "auto",
	marginRight: "auto",
	textAlign: "right",
	fontSize: "13px",
	lineHeight: "21px",
	fontWeight: "bold",
	marginTop: "7px",
}));

const ConversionInfoCard = styled(Box)(({ theme }) => ({
	width: "350px",
	fontSize: "16px",
	lineHeight: "21px",
	textAlign: "center",
	color: "#BDBDBD",
	marginLeft: "auto",
	marginRight: "auto",
	marginTop: "50px",
}));
