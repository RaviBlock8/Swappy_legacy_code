import { useState } from "react";

export default function useSelectTokenType() {
	const [tokenInType, setTokenInType] = useState(" ");
	const [tokenOutType, setTokenOutType] = useState(" ");
	const [errorMsg, setErrorMsg] = useState("");
	const [areTokenSame, setAreTokenSame] = useState(false);

	const changeTokenType = (tokenName: string, tokenType: string) => {
		switch (tokenType) {
			case "tokenIn":
				setTokenInType(tokenName);
				if (tokenName === tokenOutType) {
					setErrorMsg("Token In and Token Out cannot be of same type");
					setAreTokenSame(true);
				} else {
					setAreTokenSame(false);
					setErrorMsg("");
				}
				break;
			case "tokenOut":
				setTokenOutType(tokenName);
				if (tokenName === tokenInType) {
					setErrorMsg("Token In and Token Out cannot be of same type");
					setAreTokenSame(true);
				} else {
					setAreTokenSame(false);
					setErrorMsg("");
				}
				break;
			default:
				setErrorMsg("Not correct type of tokens");
		}
	};

	return { tokenInType, tokenOutType, errorMsg, areTokenSame, changeTokenType };
}
