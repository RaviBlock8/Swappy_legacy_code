import React from "react";
import { Box, InputBase, Select, MenuItem, Button } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import ConvertIconSvg from "../SwapWindow/ConvertIconSvg";
import ExchangeChart from "../ExchangeChart/ExchangeChart";
import { TokenDataInterface, data } from "../../addresses/tokens";

interface IPoolPage {
	tokenInType: string;
	tokenOutType: string;
	amountOftokenInType: string;
	amountOftokenOutType: string;
	changeTokenType: any;
	errorMsg: string;
	handleSubmit: any;
	areTokenSame: boolean;
	changePoolTokenAmount: any;
}
export default function PoolPage({
	tokenInType,
	tokenOutType,
	amountOftokenInType,
	amountOftokenOutType,
	changeTokenType,
	errorMsg,
	handleSubmit,
	areTokenSame,
	changePoolTokenAmount,
}: IPoolPage) {
	return (
		<SwapPageBox>
			<form onSubmit={handleSubmit}>
				<MainInputBox>
					<InputBox1>
						<Label>TOKEN A</Label>
						<InputField
							placeholder="0.00"
							type="text"
							name="amountOftokenInType"
							value={amountOftokenInType}
							onChange={(
								e:
									| React.ChangeEvent<HTMLInputElement>
									| React.ChangeEvent<HTMLTextAreaElement>
							) => {
								console.log("clicked");
								changePoolTokenAmount(
									e.target.value,
									"in",
									tokenInType,
									tokenOutType,
									areTokenSame
								);
							}}
							autoComplete="off"
						/>
						<SelectC
							value={tokenInType}
							disableUnderline={true}
							onChange={(e) => {
								changeTokenType(e.target.value, "tokenIn");
							}}
						>
							{data.map((token: TokenDataInterface) => {
								return (
									<MenuItemC value={token.address}>{token.name}</MenuItemC>
								);
							})}
						</SelectC>
					</InputBox1>
					<ConvertIconBox>
						<ConvertIconSvg />
					</ConvertIconBox>
					<InputBox1>
						<Label>TOKEN B</Label>
						<InputField
							placeholder="0.00"
							type="text"
							name="amountOftokenOutType"
							value={amountOftokenOutType}
							onChange={(
								e:
									| React.ChangeEvent<HTMLInputElement>
									| React.ChangeEvent<HTMLTextAreaElement>
							) => {
								changePoolTokenAmount(
									e.target.value,
									"out",
									tokenInType,
									tokenOutType,
									areTokenSame
								);
							}}
							autoComplete="off"
						/>
						<SelectC
							value={tokenOutType}
							disableUnderline={true}
							onChange={(e) => {
								changeTokenType(e.target.value, "tokenOut");
							}}
						>
							{data.map((token: TokenDataInterface) => {
								return (
									<MenuItemC value={token.address}>{token.name}</MenuItemC>
								);
							})}
						</SelectC>
					</InputBox1>
				</MainInputBox>
				{/* <ChartBox>
          <ExchangeChart />
        </ChartBox> */}
				<Footer type="submit" style={{ outline: "none" }}>
					Add Liquidity
				</Footer>
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
	//   display: "flex",
	//   justifyContent: "space-evenly",
}));

const MainInputBox = styled(Box)(({ theme }) => ({
	height: "200px",
	width: "420px",
	boxSizing: "border-box",
	display: "flex",
	justifyContent: "space-evenly",
}));

const InputBox1 = styled(Box)(({ theme }) => ({
	//   border: "1px solid black",
	height: "200px",
	width: "130px",
	boxSizing: "border-box",
	marginTop: "49px",
}));

const Label = styled(Box)(({ theme }) => ({
	width: "120px",
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

const ChartBox = styled(Box)(({ theme }) => ({
	width: "319px",
	height: "120px",
	border: "1px solid black",
	marginTop: "36px",
	marginLeft: "auto",
	marginRight: "auto",
	borderRadius: "8px",
}));

const ConvertIconBox = styled(Box)(({ theme }) => ({
	width: "32px",
	height: "32px",
	boxSizing: "border-box",
	position: "relative",
	top: "172px",
}));

const Footer = styled(Button)(({ theme }) => ({
	//   width: "120px",
	fontSize: "15px",
	lineHeight: "28px",
	fontWeight: "bold",
	marginLeft: "auto",
	marginRight: "auto",
	marginTop: "157px",
	color: "#4677F5",
	display: "flex",
	alignContent: "space-evenly",
	justifyContent: "space-evenly",
	borderRadius: "5px",
}));

const ExchangePriceBox = styled(Box)(({ theme }) => ({
	width: "350px",
	marginLeft: "auto",
	marginRight: "auto",
	textAlign: "right",
	fontSize: "13px",
	lineHeight: "21px",
	fontWeight: "bold",
	marginTop: "7px",
}));
