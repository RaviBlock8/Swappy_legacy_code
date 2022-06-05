import React from "react";
import { Drawer, Button, Box } from "@material-ui/core/";
import { styled } from "@material-ui/core/styles";
import CardsContainer from "./CardsContainer";
import ArrowDownSvg from "./ArrowDownSvg";
import ArrowUpSvg from "./ArrowUpSvg";
import { PriceList } from "../../utils/loadTokenBalances";

interface IProps {
	balances: PriceList[] | null;
}
export default function MyWallet({ balances }: IProps) {
	const [state, setState] = React.useState<any>({
		bottom: false,
	});

	const toggleDrawer = (anchor: string, open: boolean) => (event: any) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};

	return (
		<OuterWalletContainer>
			{["bottom"].map((anchor: any) => (
				<React.Fragment key={anchor}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							height: "50px",
							backgroundColor: "white",
						}}
					>
						<MyWalletButton
							onClick={toggleDrawer(anchor, true)}
							style={{ outline: "none" }}
						>
							<ButtonIconWrapper component="div">
								<ArrowUpSvg />
							</ButtonIconWrapper>
							<ButtonTextWrapper component="div">My Wallet</ButtonTextWrapper>
						</MyWalletButton>
					</div>
					<Drawer
						anchor={anchor}
						open={state[anchor]}
						onClose={toggleDrawer(anchor, false)}
					>
						<InnerWalletContainer>
							<MyWalletButton
								onClick={toggleDrawer(anchor, false)}
								style={{ outline: "none" }}
							>
								<ButtonIconWrapper component="div">
									<ArrowDownSvg />
								</ButtonIconWrapper>
								<ButtonTextWrapper component="div">My Wallet</ButtonTextWrapper>
							</MyWalletButton>
						</InnerWalletContainer>
						<CardsOuterLayer>
							<CardsContainer />
						</CardsOuterLayer>
					</Drawer>
				</React.Fragment>
			))}
		</OuterWalletContainer>
	);
}

const OuterWalletContainer = styled(Box)(({ theme }) => ({
	position: "fixed",
	bottom: 0,
	background: "#FFFFFF",
	boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.2)",
	borderRadius: "12px 12px 0px 0px",
	width: "100vw",
	minHeight: "9vh",
	display: "flex",
	justifyContent: "center",
}));

const InnerWalletContainer = styled(Box)(({ theme }) => ({
	background: "#FFFFFF",
	borderRadius: "12px 12px 0px 0px",
	width: "100vw",
	minHeight: "9vh",
	display: "flex",
	justifyContent: "center",
}));

const MyWalletButton = styled(Button)(({ theme }) => ({
	fontSize: "13px",
	lineHeight: "21px",
	textAlign: "center",
	color: "#4677F5",
	fontWeight: "bold",
	textTransform: "capitalize",
	display: "block",
}));

const ButtonTextWrapper = styled(Box)(({ theme }) => ({
	width: "80px",
	padding: "0px",
	margin: "0px",
}));

const ButtonIconWrapper = styled(Box)(({ theme }) => ({
	width: "78px",
	padding: "0px",
	margin: "0px",
}));

const CardsOuterLayer = styled(Box)(({ theme }) => ({
	width: "100vw",
}));
