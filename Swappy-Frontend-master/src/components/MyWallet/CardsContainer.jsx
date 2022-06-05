import React, { useState } from "react";
import useHorizontal from "@oberon-amsterdam/horizontal/hook";
import TokenCard from "../TokenCard/TokenCard";
import { Box } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import TokenData from "./TokenData";
import { connect } from "react-redux";

function CardsContainer({ balances }) {
	const [container, setContainer] = useState();
	useHorizontal({ container: container });
	return (
		<OuterCardsContainer
			component="div"
			className="container"
			ref={(ref) => {
				setContainer(ref);
			}}
		>
			{balances?.map((token) => {
				return (
					<div className="block">
						<TokenCard
							name={token.name}
							amount={token.balance.substring(0, 7)}
						/>
					</div>
				);
			})}
		</OuterCardsContainer>
	);
}

const OuterCardsContainer = styled(Box)(({ theme }) => ({
	margin: "0px",
	padding: "20px",
	display: "flex",
	background: "#ffffff",
	maxWidth: "none",
}));

const matchStateToProps = (state) => {
	return {
		balances: state.balances,
	};
};

export default connect(matchStateToProps, null)(CardsContainer);
